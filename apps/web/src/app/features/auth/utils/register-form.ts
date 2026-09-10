import type { RegisterFormValues } from '../schemas/form-schemas';

export const initialFormState: RegisterFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: 'Male',
  userRole: 'Employee',
  phoneNumber: '',
  designation: '',
  dateOfBirth: '',
  dateOfJoining: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
};

export function normalizeTenDigitPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, '');

  if (digits.length > 10 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }

  return digits.slice(0, 10);
}

export function inputClass(hasError?: string): string {
  return `h-[42px] rounded-xl bg-[var(--app-surface)] text-[14px] placeholder:text-[var(--app-text-muted)] ${
    hasError
      ? 'border-[var(--app-error)] focus:border-[var(--app-error)] focus:ring-[color:rgba(239,68,68,0.15)]'
      : 'border-[var(--app-border)] focus:border-[var(--app-primary)] focus:ring-[color:rgba(98,70,234,0.14)]'
  }`;
}
