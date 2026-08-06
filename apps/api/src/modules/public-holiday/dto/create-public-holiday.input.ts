import { IsString } from 'class-validator';

export class CreatePublicHolidayInput {
  holidayDate: Date;

  @IsString()
  title: string;
}
