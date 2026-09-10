import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreatePublicHolidayInput {
  @Type(() => Date)
  @IsDate()
  holidayDate: Date;

  @IsString()
  title: string;
}
