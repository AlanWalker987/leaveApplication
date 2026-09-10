import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as GraphqlTypes from '../../graphql-types';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UserService } from './user.service';

type RegisterInputShape = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  managerId?: string | null;
  branchId?: string | null;
  vendorId?: string | null;
  userRole: GraphqlTypes.Role;
  phoneNumber: string;
  designation: string;
  dateOfBirth: Date;
  dateOfJoining: Date;
  emergencyContactName: string;
  emergencyContactNumber: string;
};

type UpdateUserInputShape = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  managerId?: string | null;
  branchId?: string | null;
  vendorId?: string | null;
  userRole?: GraphqlTypes.Role | null;
  phoneNumber?: string | null;
  designation?: string | null;
  dateOfBirth?: Date | null;
  dateOfJoining?: Date | null;
  emergencyContactName?: string | null;
  emergencyContactNumber?: string | null;
  gender?: GraphqlTypes.Gender | null;
};

type LoginInputShape = {
  email: string;
  password: string;
};

type RefreshTokenInputShape = {
  refreshToken: string;
};

type AuthenticatedUser = {
  sub: string;
  email: string;
  role: string;
  tokenVersion: number;
};

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation('register')
  async register(@Args('input') input: RegisterInputShape): Promise<GraphqlTypes.User> {
    return await this.userService.register(input as GraphqlTypes.RegisterInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('updateUserById')
  async updateUserById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id') id: string,
    @Args('input') input: UpdateUserInputShape,
  ): Promise<GraphqlTypes.User> {
    if (user.role !== 'Admin') {
      throw new ForbiddenException('Only admin can update users');
    }

    return await this.userService.updateUserById(id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('deleteUserById')
  async deleteUserById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id') id: string,
  ): Promise<GraphqlTypes.User> {
    if (user.role !== 'Admin') {
      throw new ForbiddenException('Only admin can delete users');
    }

    return await this.userService.deleteUserById(id);
  }

  @Mutation('login')
  async login(@Args('input') input: LoginInputShape): Promise<GraphqlTypes.AuthTokens> {
    return await this.userService.login(input as GraphqlTypes.LoginInput);
  }

  @Mutation('refreshToken')
  async refreshToken(
    @Args('input') input: RefreshTokenInputShape,
  ): Promise<GraphqlTypes.AuthTokens> {
    return await this.userService.refreshToken(input as GraphqlTypes.RefreshTokenInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('logoutAllTabs')
  async logoutAllTabs(@CurrentUser() user: AuthenticatedUser): Promise<boolean> {
    return await this.userService.logoutAllTabs(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Query('me')
  async me(@CurrentUser() user: AuthenticatedUser): Promise<GraphqlTypes.User | null> {
    return await this.userService.me(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Query('getAllUsers')
  async getAllUsers(
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
    @Args('search') search?: string,
    @Args('sortBy') sortBy?: string,
    @Args('sortOrder') sortOrder?: string,
  ): Promise<GraphqlTypes.UserListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return await this.userService.getAllUsers(pagination, search, sortBy, sortOrder);
  }
}
