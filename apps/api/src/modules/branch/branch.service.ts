import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import * as GraphqlTypes from '../../graphql-types';

@Injectable()
export class BranchService {
  constructor(private prismaService: PrismaService) {}

  async getAllBranches(pagination: {
    offset: number;
    limit: number;
  }): Promise<GraphqlTypes.BranchListResponse> {
    const { offset, limit } = pagination;
    const branches = await this.prismaService.branch.findMany({
      skip: offset,
      take: limit,
    });

    return { results: branches, totalCount: branches.length };
  }

  async getBranchById(id: string): Promise<GraphqlTypes.Branch | null> {
    const branch = await this.prismaService.branch.findUnique({
      where: { id },
    });

    if (!branch) {
      return null;
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
      where: { id },
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
      where: { id },
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
