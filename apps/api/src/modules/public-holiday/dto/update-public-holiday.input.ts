import { IsOptional, IsString } from 'class-validator';

export class UpdatePublicHolidayInput {
  holidayDate?: Date;

  @IsString()
  @IsOptional()
  title?: string;
}
