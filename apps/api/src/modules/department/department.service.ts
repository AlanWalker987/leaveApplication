import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import * as GraphqlTypes from '../../graphql-types';

@Injectable()
export class DepartmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllDepartments(pagination: {
    offset: number;
    limit: number;
  }): Promise<GraphqlTypes.DepartmentListResponse> {
    const { offset, limit } = pagination;
    const departments = await this.prismaService.department.findMany({
      skip: offset,
      take: limit,
    });

    return { results: departments, totalCount: departments.length };
  }

  async getDepartmentById(id: string): Promise<GraphqlTypes.Department | null> {
    const department = await this.prismaService.department.findUnique({
      where: { id },
    });

    if (!department) {
      return null;
    }

    return department;
  }

  async createDepartment(
    input: GraphqlTypes.CreateDepartmentInput,
  ): Promise<GraphqlTypes.Department> {
    if (!input || typeof input !== 'object') {
      throw new BadRequestException('Input is required');
    }

    const name = input.name?.trim();
    const subtitle = input.subtitle?.trim();
    const location = input.location?.trim();
    const managerId = input.managerId?.trim();

    if (!name || !subtitle || !location || !managerId) {
      throw new BadRequestException('name, subtitle, location, and managerId are required');
    }

    const existingDepartment = await this.prismaService.department.findFirst({
      where: { name },
    });

    if (existingDepartment) {
      throw new BadRequestException('Department with the same name already exists');
    }

    const manager = await this.prismaService.user.findUnique({
      where: { id: managerId },
    });

    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    const department = await this.prismaService.department.create({
      data: {
        name,
        subtitle,
        location,
        managerId,
      },
    });

    return department;
  }

  async updateDepartmentById(
    id: string,
    input: GraphqlTypes.UpdateDepartmentInput,
  ): Promise<GraphqlTypes.Department> {
    const existingDepartment = await this.prismaService.department.findFirst({
      where: { id },
    });

    if (!existingDepartment) {
      throw new NotFoundException('Department not found');
    }

    const name = input.name?.trim() ?? existingDepartment.name;
    const subtitle = input.subtitle?.trim() ?? existingDepartment.subtitle;
    const location = input.location?.trim() ?? existingDepartment.location;
    const managerId = input.managerId?.trim() ?? existingDepartment.managerId;

    if (input.managerId && input.managerId.trim()) {
      const manager = await this.prismaService.user.findUnique({
        where: { id: managerId },
      });

      if (!manager) {
        throw new NotFoundException('Manager not found');
      }
    }

    const updatedDepartment = await this.prismaService.department.update({
      where: { id },
      data: {
        name,
        subtitle,
        location,
        managerId,
      },
    });

    return updatedDepartment;
  }

  async deleteDepartmentById(id: string): Promise<GraphqlTypes.Department> {
    const existingDepartment = await this.prismaService.department.findFirst({
      where: { id },
    });

    if (!existingDepartment) {
      throw new NotFoundException('Department not found');
    }

    const deletedDepartment = await this.prismaService.department.update({
      where: { id },
      data: { isDeleted: true },
    });

    return deletedDepartment;
  }
}
