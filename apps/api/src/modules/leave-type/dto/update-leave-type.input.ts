import { IsOptional, IsString } from 'class-validator';

export class UpdateLeaveTypeInput {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
