import { z } from 'zod';

export const leaveTypeFormSchema = z.object({
  code: z.string().trim().min(1, 'Code is required.'),
  description: z.string().trim().min(1, 'Description is required.'),
});

export type LeaveTypeFormValues = z.infer<typeof leaveTypeFormSchema>;
