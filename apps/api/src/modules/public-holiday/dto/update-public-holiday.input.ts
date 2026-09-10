import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdatePublicHolidayInput {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  holidayDate?: Date;

  @IsString()
  @IsOptional()
  title?: string;
}
