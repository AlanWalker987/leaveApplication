import { z } from 'zod';

export const publicHolidayFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  holidayDate: z.string().trim().min(1, 'Holiday date is required.'),
});

export type PublicHolidayFormValues = z.infer<typeof publicHolidayFormSchema>;
