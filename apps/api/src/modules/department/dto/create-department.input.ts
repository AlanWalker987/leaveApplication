import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentInput {
  @IsString()
  name: string;

  @IsString()
  subtitle: string;

  @IsString()
  location: string;

  @IsString()
  managerId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  employeeIds?: string[];
}
