import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import * as GraphqlTypes from '../../graphql-types';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateLeaveInput } from './dto/create-leave.input';
import { LeaveService } from './leave.service';

type AuthenticatedUser = {
  sub: string;
  email: string;
  role: GraphqlTypes.Role;
  tokenVersion: number;
};

@Resolver()
export class LeaveResolver {
  constructor(private readonly leaveService: LeaveService) {}

  @UseGuards(JwtAuthGuard)
  @Query('getAllLeaves')
  async getAllLeaves(
    @CurrentUser() user: AuthenticatedUser,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
    @Args('status') status?: GraphqlTypes.LeaveStatus,
    @Args('search') search?: string,
  ): Promise<GraphqlTypes.LeaveListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 100),
    };

    return await this.leaveService.getAllLeaves(user, pagination, status, search);
  }

  @UseGuards(JwtAuthGuard)
  @Query('getMyLeaves')
  async getMyLeaves(
    @CurrentUser() user: AuthenticatedUser,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<GraphqlTypes.LeaveListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return await this.leaveService.getMyLeaves(user, pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Query('getTeamLeaves')
  async getTeamLeaves(
    @CurrentUser() user: AuthenticatedUser,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
    @Args('status') status?: GraphqlTypes.LeaveStatus,
  ): Promise<GraphqlTypes.LeaveListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 50),
    };

    return await this.leaveService.getTeamLeaves(user, pagination, status);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('createLeave')
  async createLeave(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateLeaveInput,
  ): Promise<GraphqlTypes.LeaveRequest> {
    return await this.leaveService.createLeave(
      user,
      input as unknown as GraphqlTypes.CreateLeaveInput,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('cancelLeaveById')
  async cancelLeaveById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphqlTypes.LeaveRequest> {
    return await this.leaveService.cancelLeaveById(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('reviewLeaveById')
  async reviewLeaveById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', ParseUUIDPipe) id: string,
    @Args('status') status: GraphqlTypes.LeaveStatus,
    @Args('comments') comments?: string,
  ): Promise<GraphqlTypes.LeaveRequest> {
    return await this.leaveService.reviewLeaveById(user, id, status, comments);
  }
}
