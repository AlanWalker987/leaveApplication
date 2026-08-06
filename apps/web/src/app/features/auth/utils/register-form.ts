import type { RegisterFormValues } from '../schemas/form-schemas';

export const initialFormState: RegisterFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
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
  return `h-[42px] rounded-xl bg-white text-[14px] placeholder:text-[#9aa6bc] ${
    hasError
      ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[color:rgba(239,68,68,0.15)]'
      : 'border-[#d8e2f0] focus:border-[#6246ea] focus:ring-[color:rgba(98,70,234,0.14)]'
  }`;
}
