import type { RegisterFormValues } from '../schemas/form-schemas';

export type SectionKey = 'personal' | 'security' | 'work' | 'emergency';

export const sectionOrder: SectionKey[] = ['personal', 'security', 'work', 'emergency'];

export const sectionFieldMap: Record<SectionKey, Array<keyof RegisterFormValues>> = {
  personal: ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth'],
  security: ['password', 'confirmPassword'],
  work: ['userRole', 'designation', 'dateOfJoining'],
  emergency: ['emergencyContactName', 'emergencyContactNumber'],
};

export const initialOpenSections: Record<SectionKey, boolean> = {
  personal: true,
  security: false,
  work: false,
  emergency: false,
};
