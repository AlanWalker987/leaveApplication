import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import * as GraphqlTypes from '../../graphql-types';
import { CreateLeaveTypeInput } from './dto/create-leave-type.input';
import { UpdateLeaveTypeInput } from './dto/update-leave-type.input';
import { LeaveTypeService } from './leave-type.service';

@Resolver()
export class LeaveTypeResolver {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Query('getLeaveTypes')
  async getLeaveTypes(
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<GraphqlTypes.LeaveTypeListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return this.leaveTypeService.getAllLeaveTypes(pagination);
  }

  @Query('getLeaveTypeById')
  async getLeaveTypeById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphqlTypes.LeaveType | null> {
    return this.leaveTypeService.getLeaveTypeById(id);
  }

  @Mutation('createLeaveType')
  async createLeaveType(
    @Args('input') input: CreateLeaveTypeInput,
  ): Promise<GraphqlTypes.LeaveType> {
    return this.leaveTypeService.createLeaveType(input as GraphqlTypes.CreateLeaveTypeInput);
  }

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

  @Mutation('deleteLeaveTypeById')
  async deleteLeaveTypeById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphqlTypes.LeaveType> {
    return this.leaveTypeService.deleteLeaveTypeById(id);
  }
}
