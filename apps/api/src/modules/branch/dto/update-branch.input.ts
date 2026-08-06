import { IsOptional, IsString } from 'class-validator';

export class UpdateBranchInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  code?: string;
}
