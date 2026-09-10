import { z } from 'zod';

export const branchFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  code: z.string().trim().min(1, 'Code is required.'),
  location: z.string().trim().min(1, 'Location is required.'),
});

export type BranchFormValues = z.infer<typeof branchFormSchema>;
