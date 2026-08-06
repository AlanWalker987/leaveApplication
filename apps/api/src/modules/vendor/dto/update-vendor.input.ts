import { IsOptional, IsString } from 'class-validator';

export class UpdateVendorInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  contactName?: string;

  @IsString()
  @IsOptional()
  contactNumber?: string;

  @IsString()
  @IsOptional()
  contactEmail?: string;
}
