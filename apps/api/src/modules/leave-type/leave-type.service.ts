import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import * as GraphqlTypes from '../../graphql-types';

@Injectable()
export class LeaveTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllLeaveTypes(pagination: {
    offset: number;
    limit: number;
  }): Promise<GraphqlTypes.LeaveTypeListResponse> {
    const { offset, limit } = pagination;
    const leaveTypes = await this.prismaService.leaveTypes.findMany({
      skip: offset,
      take: limit,
    });

    return { results: leaveTypes, totalCount: leaveTypes.length };
  }

  async getLeaveTypeById(id: string): Promise<GraphqlTypes.LeaveType | null> {
    const leaveType = await this.prismaService.leaveTypes.findUnique({
      where: { id },
    });

    if (!leaveType) {
      return null;
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
