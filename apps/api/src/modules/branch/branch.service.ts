import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import * as GraphqlTypes from '../../graphql-types';

@Injectable()
export class BranchService {
  constructor(private prismaService: PrismaService) {}

  async getAllBranches(
    pagination: {
      offset: number;
      limit: number;
    },
    search?: string,
    sortBy?: string,
    sortOrder?: string,
  ): Promise<GraphqlTypes.BranchListResponse> {
    const { offset, limit } = pagination;
    const normalizedSearch = search?.trim();
    const where = {
      isDeleted: false,
      ...(normalizedSearch
        ? { name: { contains: normalizedSearch, mode: 'insensitive' as const } }
        : {}),
    };

    const [branches, totalCount] = await this.prismaService.$transaction([
      this.prismaService.branch.findMany({
        where,
        orderBy: this.getBranchOrderBy(sortBy, sortOrder),
        skip: offset,
        take: limit,
      }),
      this.prismaService.branch.count({
        where,
      }),
    ]);

    return { results: branches, totalCount };
  }

  private getBranchOrderBy(
    sortBy?: string,
    sortOrder?: string,
  ): Prisma.BranchOrderByWithRelationInput[] {
    const order: Prisma.SortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    switch (sortBy) {
      case 'name':
        return [{ name: order }, { createdAt: 'desc' }];
      case 'code':
        return [{ code: order }, { name: 'asc' }];
      case 'location':
        return [{ location: order }, { name: 'asc' }];
      case 'createdAt':
        return [{ createdAt: order }, { name: 'asc' }];
      default:
        return [{ name: 'asc' }, { createdAt: 'desc' }];
    }
  }

  async getBranchById(id: string): Promise<GraphqlTypes.Branch | null> {
    const branch = await this.prismaService.branch.findFirst({
      where: { id, isDeleted: false },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async createBranch(input: GraphqlTypes.CreateBranchInput): Promise<GraphqlTypes.Branch> {
    if (!input || typeof input !== 'object') {
      throw new BadRequestException('Input is required');
    }

    const code = input.code?.trim();
    const name = input.name?.trim();
    const location = input.location?.trim();

    if (!code || !name || !location) {
      throw new BadRequestException('code, name, and location are required');
    }

    const existingBranch = await this.prismaService.branch.findFirst({
      where: {
        OR: [{ name }, { code }],
      },
    });

    if (existingBranch) {
      throw new BadRequestException('Branch with the same name or code already exists');
    }

    const branch = await this.prismaService.branch.create({
      data: {
        code,
        name,
        location,
      },
    });

    return branch;
  }

  async updateBranchById(
    id: string,
    input: GraphqlTypes.UpdateBranchInput,
  ): Promise<GraphqlTypes.Branch> {
    const { code, location, name } = input;
    const existingBranch = await this.prismaService.branch.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existingBranch) {
      throw new NotFoundException('Branch not found');
    }

    const updatedBranch = await this.prismaService.branch.update({
      where: { id },
      data: {
        code: code ?? existingBranch.code,
        name: name ?? existingBranch.name,
        location: location ?? existingBranch.location,
      },
    });

    return updatedBranch;
  }

  // soft deleting the branch by setting isDeleted to true
  async deleteBranchById(id: string): Promise<GraphqlTypes.Branch> {
    const existingBranch = await this.prismaService.branch.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existingBranch) {
      throw new NotFoundException('Branch not found');
    }

    const deletedBranch = await this.prismaService.branch.update({
      where: { id },
      data: { isDeleted: true },
    });

    return deletedBranch;
  }
}
