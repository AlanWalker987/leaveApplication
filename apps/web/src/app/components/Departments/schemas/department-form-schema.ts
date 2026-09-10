import { z } from 'zod';

export const departmentFormSchema = z.object({
  name: z.string().trim().min(1, 'Department name is required.'),
  subtitle: z.string().trim().min(1, 'Department subtitle is required.'),
  branchId: z.string().trim().min(1, 'Branch is required.'),
  managerId: z.string().trim().min(1, 'Manager is required.'),
  employeeIds: z.array(z.string()),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
