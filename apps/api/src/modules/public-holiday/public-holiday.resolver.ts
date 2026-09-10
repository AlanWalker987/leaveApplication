import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import * as GraphqlTypes from '../../graphql-types';
import { CreatePublicHolidayInput } from './dto/create-public-holiday.input';
import { UpdatePublicHolidayInput } from './dto/update-public-holiday.input';
import { PublicHolidayService } from './public-holiday.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Resolver()
export class PublicHolidayResolver {
  constructor(private readonly publicHolidayService: PublicHolidayService) {}

  @UseGuards(JwtAuthGuard)
  @Query('getPublicHolidays')
  async getPublicHolidays(
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
    @Args('search') search?: string,
    @Args('sortBy') sortBy?: string,
    @Args('sortOrder') sortOrder?: string,
  ): Promise<GraphqlTypes.PublicHolidayListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return this.publicHolidayService.getAllPublicHolidays(pagination, search, sortBy, sortOrder);
  }

  @UseGuards(JwtAuthGuard)
  @Query('getPublicHolidayById')
  async getPublicHolidayById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphqlTypes.PublicHoliday | null> {
    return this.publicHolidayService.getPublicHolidayById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('createPublicHoliday')
  async createPublicHoliday(
    @Args('input') input: CreatePublicHolidayInput,
  ): Promise<GraphqlTypes.PublicHoliday> {
    return this.publicHolidayService.createPublicHoliday(
      input as GraphqlTypes.CreatePublicHolidayInput,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('updatePublicHolidayById')
  async updatePublicHolidayById(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdatePublicHolidayInput,
  ): Promise<GraphqlTypes.PublicHoliday> {
    return this.publicHolidayService.updatePublicHolidayById(
      id,
      input as GraphqlTypes.UpdatePublicHolidayInput,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('deletePublicHolidayById')
  async deletePublicHolidayById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphqlTypes.PublicHoliday> {
    return this.publicHolidayService.deletePublicHolidayById(id);
  }
}
