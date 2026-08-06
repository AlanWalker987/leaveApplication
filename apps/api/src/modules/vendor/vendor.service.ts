import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import * as GraphqlTypes from '../../graphql-types';

@Injectable()
export class VendorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllVendors(pagination: {
    offset: number;
    limit: number;
  }): Promise<GraphqlTypes.VendorListResponse> {
    const { offset, limit } = pagination;
    const vendors = await this.prismaService.vendor.findMany({
      skip: offset,
      take: limit,
    });

    return { results: vendors, totalCount: vendors.length };
  }

  async getVendorById(id: string): Promise<GraphqlTypes.Vendor | null> {
    const vendor = await this.prismaService.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      return null;
    }

    return vendor;
  }

  async createVendor(input: GraphqlTypes.CreateVendorInput): Promise<GraphqlTypes.Vendor> {
    if (!input || typeof input !== 'object') {
      throw new BadRequestException('Input is required');
    }

    const name = input.name?.trim();
    const contactName = input.contactName?.trim();
    const contactNumber = input.contactNumber?.trim();
    const contactEmail = input.contactEmail?.trim().toLowerCase();

    if (!name || !contactName || !contactNumber || !contactEmail) {
      throw new BadRequestException(
        'name, contactName, contactNumber, and contactEmail are required',
      );
    }

    const existingVendor = await this.prismaService.vendor.findFirst({
      where: { contactEmail },
    });

    if (existingVendor) {
      throw new BadRequestException('Vendor with the same contactEmail already exists');
    }

    const vendor = await this.prismaService.vendor.create({
      data: {
        name,
        contactName,
        contactNumber,
        contactEmail,
      },
    });

    return vendor;
  }

  async updateVendorById(
    id: string,
    input: GraphqlTypes.UpdateVendorInput,
  ): Promise<GraphqlTypes.Vendor> {
    const existingVendor = await this.prismaService.vendor.findFirst({
      where: { id },
    });

    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }

    const name = input.name?.trim() ?? existingVendor.name;
    const contactName = input.contactName?.trim() ?? existingVendor.contactName;
    const contactNumber = input.contactNumber?.trim() ?? existingVendor.contactNumber;
    const contactEmail =
      input.contactEmail?.trim().toLowerCase() ?? existingVendor.contactEmail.toLowerCase();

    const updatedVendor = await this.prismaService.vendor.update({
      where: { id },
      data: {
        name,
        contactName,
        contactNumber,
        contactEmail,
      },
    });

    return updatedVendor;
  }

  async deleteVendorById(id: string): Promise<GraphqlTypes.Vendor> {
    const existingVendor = await this.prismaService.vendor.findFirst({
      where: { id },
    });

    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }

    const deletedVendor = await this.prismaService.vendor.update({
      where: { id },
      data: { isDeleted: true },
    });

    return deletedVendor;
  }
}
