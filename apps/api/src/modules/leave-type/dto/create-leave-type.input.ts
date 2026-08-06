import { IsString } from 'class-validator';

export class CreateLeaveTypeInput {
  @IsString()
  code: string;

  @IsString()
  description: string;
}
