import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import * as GraphqlTypes from '../../graphql-types';
import { CreatePublicHolidayInput } from './dto/create-public-holiday.input';
import { UpdatePublicHolidayInput } from './dto/update-public-holiday.input';
import { PublicHolidayService } from './public-holiday.service';

@Resolver()
export class PublicHolidayResolver {
  constructor(private readonly publicHolidayService: PublicHolidayService) {}

  @Query('getPublicHolidays')
  async getPublicHolidays(
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<GraphqlTypes.PublicHolidayListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return this.publicHolidayService.getAllPublicHolidays(pagination);
  }

  @Query('getPublicHolidayById')
  async getPublicHolidayById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphqlTypes.PublicHoliday | null> {
    return this.publicHolidayService.getPublicHolidayById(id);
  }

  @Mutation('createPublicHoliday')
  async createPublicHoliday(
    @Args('input') input: CreatePublicHolidayInput,
  ): Promise<GraphqlTypes.PublicHoliday> {
    return this.publicHolidayService.createPublicHoliday(
      input as GraphqlTypes.CreatePublicHolidayInput,
    );
  }

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

  @Mutation('deletePublicHolidayById')
  async deletePublicHolidayById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphqlTypes.PublicHoliday> {
    return this.publicHolidayService.deletePublicHolidayById(id);
  }
}
