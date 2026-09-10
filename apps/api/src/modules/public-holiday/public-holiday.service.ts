import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import * as GraphqlTypes from '../../graphql-types';

@Injectable()
export class PublicHolidayService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllPublicHolidays(
    pagination: {
      offset: number;
      limit: number;
    },
    search?: string,
    sortBy?: string,
    sortOrder?: string,
  ): Promise<GraphqlTypes.PublicHolidayListResponse> {
    const { offset, limit } = pagination;
    const normalizedSearch = search?.trim();
    const where = {
      isDeleted: false,
      ...(normalizedSearch
        ? { title: { contains: normalizedSearch, mode: 'insensitive' as const } }
        : {}),
    };

    const [publicHolidays, totalCount] = await this.prismaService.$transaction([
      this.prismaService.publicHolidays.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: this.getPublicHolidayOrderBy(sortBy, sortOrder),
      }),
      this.prismaService.publicHolidays.count({ where }),
    ]);

    return { results: publicHolidays, totalCount };
  }

  private getPublicHolidayOrderBy(
    sortBy?: string,
    sortOrder?: string,
  ): Prisma.PublicHolidaysOrderByWithRelationInput[] {
    const order: Prisma.SortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    switch (sortBy) {
      case 'title':
        return [{ title: order }, { holidayDate: 'asc' }];
      case 'holidayDate':
        return [{ holidayDate: order }, { title: 'asc' }];
      case 'createdAt':
        return [{ createdAt: order }, { holidayDate: 'asc' }];
      default:
        return [{ holidayDate: 'asc' }, { createdAt: 'desc' }];
    }
  }

  async getPublicHolidayById(id: string): Promise<GraphqlTypes.PublicHoliday | null> {
    const publicHoliday = await this.prismaService.publicHolidays.findUnique({
      where: { id },
    });

    if (!publicHoliday) {
      throw new NotFoundException('Public holiday not found');
    }

    return publicHoliday;
  }

  async createPublicHoliday(
    input: GraphqlTypes.CreatePublicHolidayInput,
  ): Promise<GraphqlTypes.PublicHoliday> {
    if (!input || typeof input !== 'object') {
      throw new BadRequestException('Input is required');
    }

    const title = input.title?.trim();
    const holidayDate = new Date(input.holidayDate);

    if (!title || Number.isNaN(holidayDate.getTime())) {
      throw new BadRequestException('title and a valid holidayDate are required');
    }

    const existingPublicHoliday = await this.prismaService.publicHolidays.findFirst({
      where: {
        title,
        holidayDate,
      },
    });

    if (existingPublicHoliday) {
      throw new BadRequestException('Public holiday with the same title and date already exists');
    }

    const now = new Date();
    const publicHoliday = await this.prismaService.publicHolidays.create({
      data: {
        title,
        holidayDate,
        createdAt: now,
        updatedAt: now,
      },
    });

    return publicHoliday;
  }

  async updatePublicHolidayById(
    id: string,
    input: GraphqlTypes.UpdatePublicHolidayInput,
  ): Promise<GraphqlTypes.PublicHoliday> {
    const existingPublicHoliday = await this.prismaService.publicHolidays.findFirst({
      where: { id },
    });

    if (!existingPublicHoliday) {
      throw new NotFoundException('Public holiday not found');
    }

    const title = input.title?.trim() ?? existingPublicHoliday.title;
    const holidayDate = input.holidayDate
      ? new Date(input.holidayDate)
      : existingPublicHoliday.holidayDate;

    if (!title || Number.isNaN(holidayDate.getTime())) {
      throw new BadRequestException('title and a valid holidayDate are required');
    }

    const updatedPublicHoliday = await this.prismaService.publicHolidays.update({
      where: { id },
      data: {
        title,
        holidayDate,
      },
    });

    return updatedPublicHoliday;
  }

  async deletePublicHolidayById(id: string): Promise<GraphqlTypes.PublicHoliday> {
    const existingPublicHoliday = await this.prismaService.publicHolidays.findFirst({
      where: { id },
    });

    if (!existingPublicHoliday) {
      throw new NotFoundException('Public holiday not found');
    }

    const deletedPublicHoliday = await this.prismaService.publicHolidays.update({
      where: { id },
      data: { isDeleted: true },
    });

    return deletedPublicHoliday;
  }
}
