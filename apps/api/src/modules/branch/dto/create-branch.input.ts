import { IsString } from 'class-validator';

export class CreateBranchInput {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  code: string;
}
