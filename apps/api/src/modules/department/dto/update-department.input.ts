import { IsOptional, IsString } from 'class-validator';

export class UpdateDepartmentInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  managerId?: string;
}
