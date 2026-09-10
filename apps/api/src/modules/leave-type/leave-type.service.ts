import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import * as GraphqlTypes from '../../graphql-types';

@Injectable()
export class LeaveTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllLeaveTypes(
    pagination: {
      offset: number;
      limit: number;
    },
    search?: string,
    sortBy?: string,
    sortOrder?: string,
  ): Promise<GraphqlTypes.LeaveTypeListResponse> {
    const { offset, limit } = pagination;
    const normalizedSearch = search?.trim();
    const where = {
      isDeleted: false,
      ...(normalizedSearch
        ? { description: { contains: normalizedSearch, mode: 'insensitive' as const } }
        : {}),
    };

    const [leaveTypes, totalCount] = await this.prismaService.$transaction([
      this.prismaService.leaveTypes.findMany({
        where,
        orderBy: this.getLeaveTypeOrderBy(sortBy, sortOrder),
        skip: offset,
        take: limit,
      }),
      this.prismaService.leaveTypes.count({ where }),
    ]);

    return { results: leaveTypes, totalCount };
  }

  private getLeaveTypeOrderBy(
    sortBy?: string,
    sortOrder?: string,
  ): Prisma.LeaveTypesOrderByWithRelationInput[] {
    const order: Prisma.SortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    switch (sortBy) {
      case 'code':
        return [{ code: order }, { description: 'asc' }];
      case 'description':
        return [{ description: order }, { createAt: 'desc' }];
      case 'createAt':
        return [{ createAt: order }, { description: 'asc' }];
      case 'updatedAt':
        return [{ updatedAt: order }, { description: 'asc' }];
      default:
        return [{ description: 'asc' }, { createAt: 'desc' }];
    }
  }

  async getLeaveTypeById(id: string): Promise<GraphqlTypes.LeaveType | null> {
    const leaveType = await this.prismaService.leaveTypes.findUnique({
      where: { id },
    });

    if (!leaveType) {
      throw new NotFoundException('Leave Type not found');
    }

    return leaveType;
  }

  async createLeaveType(input: GraphqlTypes.CreateLeaveTypeInput): Promise<GraphqlTypes.LeaveType> {
    if (!input || typeof input !== 'object') {
      throw new BadRequestException('Input is required');
    }

    const code = input.code?.trim();
    const description = input.description?.trim();

    if (!code || !description) {
      throw new BadRequestException('code and description are required');
    }

    const existingLeaveType = await this.prismaService.leaveTypes.findFirst({
      where: { code },
    });

    if (existingLeaveType) {
      throw new BadRequestException('Leave type with the same code already exists');
    }

    const leaveType = await this.prismaService.leaveTypes.create({
      data: {
        code,
        description,
      },
    });

    return leaveType;
  }

  async updateLeaveTypeById(
    id: string,
    input: GraphqlTypes.UpdateLeaveTypeInput,
  ): Promise<GraphqlTypes.LeaveType> {
    const existingLeaveType = await this.prismaService.leaveTypes.findFirst({
      where: { id },
    });

    if (!existingLeaveType) {
      throw new NotFoundException('Leave type not found');
    }

    const code = input.code?.trim() ?? existingLeaveType.code;
    const description = input.description?.trim() ?? existingLeaveType.description;

    const updatedLeaveType = await this.prismaService.leaveTypes.update({
      where: { id },
      data: {
        code,
        description,
      },
    });

    return updatedLeaveType;
  }

  async deleteLeaveTypeById(id: string): Promise<GraphqlTypes.LeaveType> {
    const existingLeaveType = await this.prismaService.leaveTypes.findFirst({
      where: { id },
    });

    if (!existingLeaveType) {
      throw new NotFoundException('Leave type not found');
    }

    const deletedLeaveType = await this.prismaService.leaveTypes.update({
      where: { id },
      data: { isDeleted: true },
    });

    return deletedLeaveType;
  }
}
