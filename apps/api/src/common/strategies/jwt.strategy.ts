import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma/prisma.service';

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  tokenVersion: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('auth.accessSecret') ??
        configService.get<string>('JWT_ACCESS_SECRET') ??
        'dev_access_secret',
    });
  }

  async validate(payload: AccessTokenPayload) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Invalid access token');
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Session expired. Please login again');
    }

    return {
      sub: user.id,
      email: user.email,
      role: user.userRole,
      tokenVersion: user.tokenVersion,
    };
  }
}
