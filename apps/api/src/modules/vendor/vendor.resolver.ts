import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import * as GraphqlTypes from '../../graphql-types';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { VendorService } from './vendor.service';

@Resolver()
export class VendorResolver {
  constructor(private readonly vendorService: VendorService) {}

  @Query('getVendors')
  async getVendors(
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<GraphqlTypes.VendorListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return this.vendorService.getAllVendors(pagination);
  }

  @Query('getVendorById')
  async getVendorById(@Args('id', ParseUUIDPipe) id: string): Promise<GraphqlTypes.Vendor | null> {
    return this.vendorService.getVendorById(id);
  }

  @Mutation('createVendor')
  async createVendor(@Args('input') input: CreateVendorInput): Promise<GraphqlTypes.Vendor> {
    return this.vendorService.createVendor(input as GraphqlTypes.CreateVendorInput);
  }

  @Mutation('updateVendorById')
  async updateVendorById(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateVendorInput,
  ): Promise<GraphqlTypes.Vendor> {
    return this.vendorService.updateVendorById(id, input as GraphqlTypes.UpdateVendorInput);
  }

  @Mutation('deleteVendorById')
  async deleteVendorById(@Args('id', ParseUUIDPipe) id: string): Promise<GraphqlTypes.Vendor> {
    return this.vendorService.deleteVendorById(id);
  }
}
