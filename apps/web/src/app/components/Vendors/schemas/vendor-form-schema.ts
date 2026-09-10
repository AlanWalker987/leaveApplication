import { z } from 'zod';

export const vendorFormSchema = z.object({
  name: z.string().trim().min(1, 'Vendor name is required.'),
  contactName: z.string().trim().min(1, 'Contact name is required.'),
  contactEmail: z.string().trim().email('Valid contact email is required.'),
  contactNumber: z.string().trim().min(1, 'Contact number is required.'),
});

export type VendorFormValues = z.infer<typeof vendorFormSchema>;
