import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma/prisma.service';
import * as GraphqlTypes from '../../graphql-types';

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  tokenVersion: number;
};

type RefreshTokenPayload = AccessTokenPayload & {
  sid: string;
};

type UserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  managerId: string | null;
  branchId: string | null;
  vendorId: string | null;
  userRole: string;
  phoneNumber: string;
  designation: string;
  dateOfBirth: Date;
  dateOfJoining: Date;
  emergencyContactName: string;
  emergencyContactNumber: string;
  createAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(input: GraphqlTypes.RegisterInput): Promise<GraphqlTypes.User> {
    const email = this.normalizeEmail(input.email);
    this.validatePassword(input.password);
    const managerId = input.managerId?.trim() || null;
    const branchId = input.branchId?.trim() || null;
    const vendorId = input.vendorId?.trim() || null;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (branchId) {
      const branch = await this.prismaService.branch.findUnique({
        where: { id: branchId },
      });

      if (!branch || branch.isDeleted) {
        throw new BadRequestException('Invalid branchId');
      }
    }

    if (vendorId) {
      const vendor = await this.prismaService.vendor.findUnique({
        where: { id: vendorId },
      });

      if (!vendor || vendor.isDeleted) {
        throw new BadRequestException('Invalid vendorId');
      }
    }

    if (managerId) {
      const manager = await this.prismaService.user.findUnique({
        where: { id: managerId },
      });

      if (!manager || manager.isDeleted) {
        throw new BadRequestException('Invalid managerId');
      }
    }

    const hash = await bcrypt.hash(input.password, this.getBcryptSaltRounds());

    const createdUser = await this.prismaService.user.create({
      data: {
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email,
        hash,
        ...(managerId ? { manager: { connect: { id: managerId } } } : {}),
        ...(branchId ? { branch: { connect: { id: branchId } } } : {}),
        ...(vendorId ? { vendor: { connect: { id: vendorId } } } : {}),
        userRole: input.userRole as unknown as GraphqlTypes.Role,
        phoneNumber: input.phoneNumber.trim(),
        designation: input.designation.trim(),
        dateOfBirth: input.dateOfBirth,
        dateOfJoining: input.dateOfJoining,
        emergencyContactName: input.emergencyContactName.trim(),
        emergencyContactNumber: input.emergencyContactNumber.trim(),
      },
    });

    return this.toGraphqlUser(createdUser);
  }

  async getAllUsers(pagination: {
    offset: number;
    limit: number;
  }): Promise<GraphqlTypes.UserListResponse> {
    const { offset, limit } = pagination;
    const users = await this.prismaService.user.findMany({
      where: { isDeleted: false },
      skip: offset,
      take: limit,
    });

    const totalCount = await this.prismaService.user.count({
      where: { isDeleted: false },
    });

    return {
      results: users.map((user) => this.toGraphqlUser(user)),
      totalCount,
    };
  }

  async login(input: GraphqlTypes.LoginInput): Promise<GraphqlTypes.AuthTokens> {
    const email = this.normalizeEmail(input.email);

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.issueTokenPair(user);
  }

  async refreshToken(input: GraphqlTypes.RefreshTokenInput): Promise<GraphqlTypes.AuthTokens> {
    let payload: RefreshTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(input.refreshToken, {
        secret: this.getRefreshSecret(),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Session expired. Please login again');
    }

    const currentSession = await this.prismaService.refreshTokenSession.findUnique({
      where: { id: payload.sid },
    });

    if (!currentSession || currentSession.userId !== user.id) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (currentSession.revokedAt || currentSession.expiresAt <= new Date()) {
      await this.revokeAllSessionsAndBumpTokenVersion(user.id);
      throw new UnauthorizedException('Refresh token revoked. Please login again');
    }

    const isTokenValid = await bcrypt.compare(input.refreshToken, currentSession.tokenHash);
    if (!isTokenValid) {
      await this.revokeAllSessionsAndBumpTokenVersion(user.id);
      throw new UnauthorizedException('Refresh token reuse detected. Please login again');
    }

    return await this.issueTokenPair(user, currentSession.id);
  }

  async logoutAllTabs(userId: string): Promise<boolean> {
    await this.revokeAllSessionsAndBumpTokenVersion(userId);
    return true;
  }

  async me(userId: string): Promise<GraphqlTypes.User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.isDeleted) {
      return null;
    }

    return this.toGraphqlUser(user);
  }

  private async issueTokenPair(
    user: {
      id: string;
      email: string;
      userRole: string;
      tokenVersion: number;
    },
    rotateFromSessionId?: string,
  ): Promise<GraphqlTypes.AuthTokens> {
    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.userRole,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: this.getAccessSecret(),
      expiresIn: this.getAccessExpiresIn(),
    });

    const newSessionId = randomUUID();
    const refreshPayload: RefreshTokenPayload = {
      ...accessPayload,
      sid: newSessionId,
    };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.getRefreshSecret(),
      expiresIn: this.getRefreshExpiresIn(),
    });

    const refreshDecoded = this.jwtService.decode(refreshToken) as { exp?: number } | null;
    const refreshExp = refreshDecoded?.exp;
    if (!refreshExp) {
      throw new UnauthorizedException('Unable to issue refresh token');
    }

    const tokenHash = await bcrypt.hash(refreshToken, this.getBcryptSaltRounds());

    await this.prismaService.$transaction(async (tx) => {
      await tx.refreshTokenSession.create({
        data: {
          id: newSessionId,
          userId: user.id,
          tokenHash,
          expiresAt: new Date(refreshExp * 1000),
        },
      });

      if (rotateFromSessionId) {
        await tx.refreshTokenSession.update({
          where: { id: rotateFromSessionId },
          data: {
            revokedAt: new Date(),
            replacedById: newSessionId,
          },
        });
      }
    });

    const accessDecoded = this.jwtService.decode(accessToken) as {
      exp?: number;
      iat?: number;
    } | null;

    const expiresIn =
      accessDecoded?.exp && accessDecoded?.iat ? accessDecoded.exp - accessDecoded.iat : 900;

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }

  private async revokeAllSessionsAndBumpTokenVersion(userId: string): Promise<void> {
    await this.prismaService.$transaction([
      this.prismaService.refreshTokenSession.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      }),
      this.prismaService.user.update({
        where: { id: userId },
        data: {
          tokenVersion: { increment: 1 },
        },
      }),
    ]);
  }

  private normalizeEmail(email: string): string {
    const normalized = email?.trim().toLowerCase();
    if (!normalized) {
      throw new BadRequestException('Email is required');
    }

    return normalized;
  }

  private validatePassword(password: string): void {
    if (!password || password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
  }

  private getAccessSecret(): string {
    return (
      this.configService.get<string>('auth.accessSecret') ??
      this.configService.get<string>('JWT_ACCESS_SECRET') ??
      'dev_access_secret'
    );
  }

  private getRefreshSecret(): string {
    return (
      this.configService.get<string>('auth.refreshSecret') ??
      this.configService.get<string>('JWT_REFRESH_SECRET') ??
      'dev_refresh_secret'
    );
  }

  private getAccessExpiresIn(): string {
    return (
      this.configService.get<string>('auth.accessExpiresIn') ??
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ??
      '15m'
    );
  }

  private getRefreshExpiresIn(): string {
    return (
      this.configService.get<string>('auth.refreshExpiresIn') ??
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ??
      '7d'
    );
  }

  private getBcryptSaltRounds(): number {
    const rounds =
      this.configService.get<number>('auth.bcryptSaltRounds') ??
      Number(this.configService.get<string>('BCRYPT_SALT_ROUNDS') ?? 10);

    return Number.isFinite(rounds) && rounds > 0 ? rounds : 10;
  }

  private toGraphqlUser(user: UserRecord): GraphqlTypes.User {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      managerId: user.managerId,
      branchId: user.branchId,
      vendorId: user.vendorId,
      userRole: user.userRole as unknown as GraphqlTypes.Role,
      phoneNumber: user.phoneNumber,
      designation: user.designation,
      dateOfBirth: user.dateOfBirth,
      dateOfJoining: user.dateOfJoining,
      emergencyContactName: user.emergencyContactName,
      emergencyContactNumber: user.emergencyContactNumber,
      createAt: user.createAt,
      updatedAt: user.updatedAt,
      isDeleted: user.isDeleted,
    };
  }
}
