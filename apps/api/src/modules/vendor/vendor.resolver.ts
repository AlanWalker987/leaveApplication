import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import * as GraphqlTypes from '../../graphql-types';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { VendorService } from './vendor.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Resolver()
export class VendorResolver {
  constructor(private readonly vendorService: VendorService) {}

  @UseGuards(JwtAuthGuard)
  @Query('getVendors')
  async getVendors(
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
    @Args('search') search?: string,
    @Args('sortBy') sortBy?: string,
    @Args('sortOrder') sortOrder?: string,
  ): Promise<GraphqlTypes.VendorListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return this.vendorService.getAllVendors(pagination, search, sortBy, sortOrder);
  }

  @UseGuards(JwtAuthGuard)
  @Query('getVendorById')
  async getVendorById(@Args('id', ParseUUIDPipe) id: string): Promise<GraphqlTypes.Vendor | null> {
    return this.vendorService.getVendorById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('createVendor')
  async createVendor(@Args('input') input: CreateVendorInput): Promise<GraphqlTypes.Vendor> {
    return this.vendorService.createVendor(input as GraphqlTypes.CreateVendorInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('updateVendorById')
  async updateVendorById(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateVendorInput,
  ): Promise<GraphqlTypes.Vendor> {
    return this.vendorService.updateVendorById(id, input as GraphqlTypes.UpdateVendorInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('deleteVendorById')
  async deleteVendorById(@Args('id', ParseUUIDPipe) id: string): Promise<GraphqlTypes.Vendor> {
    return this.vendorService.deleteVendorById(id);
  }
}
