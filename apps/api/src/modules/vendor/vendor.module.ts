import { Module } from '@nestjs/common';
import { VendorResolver } from './vendor.resolver';
import { VendorService } from './vendor.service';

@Module({
  providers: [VendorResolver, VendorService],
})
export class VendorModule {}
