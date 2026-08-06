import { Module } from '@nestjs/common';
import { LeaveTypeResolver } from './leave-type.resolver';
import { LeaveTypeService } from './leave-type.service';

@Module({
  providers: [LeaveTypeResolver, LeaveTypeService],
})
export class LeaveTypeModule {}
