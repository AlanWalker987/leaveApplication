import { BranchService } from './branch.service';
import * as GraphqlTypes from '../../graphql-types';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { CreateBranchInput } from './dto/create-branch.input';
import { UpdateBranchInput } from './dto/update-branch.input';

@Resolver()
export class BranchResolver {
  constructor(private branchService: BranchService) {}

  @Query('getBranches')
  async getBranches(
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
    @Args('search') search?: string,
    @Args('sortBy') sortBy?: string,
    @Args('sortOrder') sortOrder?: string,
  ): Promise<GraphqlTypes.BranchListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return this.branchService.getAllBranches(pagination, search, sortBy, sortOrder);
  }

  @Query('getBranchById')
  async getBranchById(@Args('id', ParseUUIDPipe) id: string): Promise<GraphqlTypes.Branch | null> {
    return this.branchService.getBranchById(id);
  }

  @Mutation('createBranch')
  async createBranch(@Args('input') input: CreateBranchInput): Promise<GraphqlTypes.Branch> {
    return this.branchService.createBranch(input as GraphqlTypes.CreateBranchInput);
  }

  @Mutation('updateBranchById')
  async updateBranchById(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateBranchInput,
  ): Promise<GraphqlTypes.Branch> {
    return this.branchService.updateBranchById(id, input as GraphqlTypes.UpdateBranchInput);
  }

  @Mutation('deleteBranchById')
  async deleteBranchById(@Args('id', ParseUUIDPipe) id: string): Promise<GraphqlTypes.Branch> {
    return this.branchService.deleteBranchById(id);
  }
}
