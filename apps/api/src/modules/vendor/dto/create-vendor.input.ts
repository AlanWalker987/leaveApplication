import { IsString } from 'class-validator';

export class CreateVendorInput {
  @IsString()
  name: string;

  @IsString()
  contactName: string;

  @IsString()
  contactNumber: string;

  @IsString()
  contactEmail: string;
}
