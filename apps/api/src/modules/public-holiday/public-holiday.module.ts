import { Module } from '@nestjs/common';
import { PublicHolidayResolver } from './public-holiday.resolver';
import { PublicHolidayService } from './public-holiday.service';

@Module({
  providers: [PublicHolidayResolver, PublicHolidayService],
})
export class PublicHolidayModule {}
