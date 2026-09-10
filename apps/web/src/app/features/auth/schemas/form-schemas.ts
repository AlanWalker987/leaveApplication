import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z
      .string()
      .min(1, 'Email is required.')
      .regex(/^[a-zA-Z0-9._%+-]+@sandvik\.com$/, 'Use a valid @sandvik.com email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters long.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    userRole: z.enum(['Admin', 'Manager', 'Employee'], {
      message: 'User role is required.',
    }),
    phoneNumber: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number.'),
    designation: z.string().min(1, 'Designation is required.'),
    dateOfBirth: z.string().min(1, 'Date of birth is required.'),
    dateOfJoining: z.string().min(1, 'Date of joining is required.'),
    emergencyContactName: z.string().min(1, 'Emergency contact name is required.'),
    emergencyContactNumber: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number.'),
    gender: z.enum(['Male', 'Female'], {
      message: 'Gender is required.',
    }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
