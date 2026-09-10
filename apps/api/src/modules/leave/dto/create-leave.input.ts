import { IsDateString, IsIn, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateLeaveInput {
  @IsString()
  @IsIn(['EL', 'AH'])
  leaveTypeCode: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  reason: string;

  @IsDateString()
  fromDate: string;

  @IsDateString()
  toDate: string;
}
