import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import * as GraphqlTypes from '../../graphql-types';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { DepartmentService } from './department.service';

@Resolver()
export class DepartmentResolver {
  constructor(private readonly departmentService: DepartmentService) {}

  @Query('getDepartments')
  async getDepartments(
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<GraphqlTypes.DepartmentListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return this.departmentService.getAllDepartments(pagination);
  }

  @Query('getDepartmentById')
  async getDepartmentById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphqlTypes.Department | null> {
    return this.departmentService.getDepartmentById(id);
  }

  @Mutation('createDepartment')
  async createDepartment(
    @Args('input') input: CreateDepartmentInput,
  ): Promise<GraphqlTypes.Department> {
    return this.departmentService.createDepartment(input as GraphqlTypes.CreateDepartmentInput);
  }

  @Mutation('updateDepartmentById')
  async updateDepartmentById(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateDepartmentInput,
  ): Promise<GraphqlTypes.Department> {
    return this.departmentService.updateDepartmentById(
      id,
      input as GraphqlTypes.UpdateDepartmentInput,
    );
  }

  @Mutation('deleteDepartmentById')
  async deleteDepartmentById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphqlTypes.Department> {
    return this.departmentService.deleteDepartmentById(id);
  }
}
