import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import * as GraphqlTypes from '../../graphql-types';
import { CreateLeaveTypeInput } from './dto/create-leave-type.input';
import { UpdateLeaveTypeInput } from './dto/update-leave-type.input';
import { LeaveTypeService } from './leave-type.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Resolver()
export class LeaveTypeResolver {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @UseGuards(JwtAuthGuard)
  @Query('getLeaveTypes')
  async getLeaveTypes(
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
    @Args('search') search?: string,
    @Args('sortBy') sortBy?: string,
    @Args('sortOrder') sortOrder?: string,
  ): Promise<GraphqlTypes.LeaveTypeListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return this.leaveTypeService.getAllLeaveTypes(pagination, search, sortBy, sortOrder);
  }

  @UseGuards(JwtAuthGuard)
  @Query('getLeaveTypeById')
  async getLeaveTypeById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphqlTypes.LeaveType | null> {
    return this.leaveTypeService.getLeaveTypeById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('createLeaveType')
  async createLeaveType(
    @Args('input') input: CreateLeaveTypeInput,
  ): Promise<GraphqlTypes.LeaveType> {
    return this.leaveTypeService.createLeaveType(input as GraphqlTypes.CreateLeaveTypeInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('updateLeaveTypeById')
  async updateLeaveTypeById(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateLeaveTypeInput,
  ): Promise<GraphqlTypes.LeaveType> {
    return this.leaveTypeService.updateLeaveTypeById(
      id,
      input as GraphqlTypes.UpdateLeaveTypeInput,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('deleteLeaveTypeById')
  async deleteLeaveTypeById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphqlTypes.LeaveType> {
    return this.leaveTypeService.deleteLeaveTypeById(id);
  }
}
