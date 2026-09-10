import { z } from 'zod';

export const userFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  email: z.string().trim().email('Valid email is required.'),
  gender: z.union([z.enum(['Male', 'Female']), z.literal('')]).optional(),
  userRole: z.enum(['Admin', 'Manager', 'Employee']),
  phoneNumber: z.string().trim().min(1, 'Phone number is required.'),
  designation: z.string().trim().min(1, 'Designation is required.'),
  dateOfBirth: z.string().trim().min(1, 'Date of birth is required.'),
  dateOfJoining: z.string().trim().min(1, 'Date of joining is required.'),
  emergencyContactName: z.string().trim().min(1, 'Emergency contact name is required.'),
  emergencyContactNumber: z.string().trim().min(1, 'Emergency contact number is required.'),
  branchId: z.string().trim().optional(),
  managerId: z.string().trim().optional(),
  vendorId: z.string().trim().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
