'use client';

import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Gender,
  type Mutation,
  type MutationRegisterArgs,
  type RegisterInput,
  type User as UserType,
  Role,
  type User,
} from '@/gql/graphql';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CREATE_USER, UPDATE_USER_BY_ID } from '@/app/graphql/admin/users/userOperations';
import { userFormSchema, type UserFormValues } from '../schemas/user-form-schema';
import { toIsoDateInput, toIsoDateTime } from '@/lib/datetimeutile';

type UpdateUserMutationData = {
  updateUserById: UserType;
};

type UpdateUserMutationVariables = {
  id: string;
  input: {
    firstName: string;
    lastName: string;
    email: string;
    gender?: Gender;
    userRole: Role;
    phoneNumber: string;
    designation: string;
    dateOfBirth: string;
    dateOfJoining: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    branchId?: string;
    managerId?: string;
    vendorId?: string;
  };
};

type UserSheetFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  initialUser?: User;
  branchOptions: Array<{ id: string; label: string }>;
  vendorOptions: Array<{ id: string; label: string }>;
  managerOptions: Array<{ id: string; label: string }>;
  onSuccess?: () => Promise<void> | void;
};

const EMPTY_FORM: UserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  gender: '',
  userRole: 'Employee',
  phoneNumber: '',
  designation: '',
  dateOfBirth: '',
  dateOfJoining: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  branchId: '',
  managerId: '',
  vendorId: '',
};

function getInitialValues(mode: 'create' | 'edit', initialUser?: User): UserFormValues {
  if (mode === 'edit' && initialUser) {
    return {
      firstName: initialUser.firstName,
      lastName: initialUser.lastName,
      email: initialUser.email,
      gender: initialUser.gender ?? '',
      userRole: initialUser.userRole,
      phoneNumber: initialUser.phoneNumber,
      designation: initialUser.designation,
      dateOfBirth: toIsoDateInput(initialUser.dateOfBirth),
      dateOfJoining: toIsoDateInput(initialUser.dateOfJoining),
      emergencyContactName: initialUser.emergencyContactName,
      emergencyContactNumber: initialUser.emergencyContactNumber,
      branchId: initialUser.branchId ?? '',
      managerId: initialUser.managerId ?? '',
      vendorId: initialUser.vendorId ?? '',
    };
  }

  return EMPTY_FORM;
}

function generateTemporaryPassword(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => (byte % 36).toString(36)).join('') + 'A1!';
}

export function UserSheetForm({
  open,
  onOpenChange,
  mode = 'create',
  initialUser,
  branchOptions,
  vendorOptions,
  managerOptions,
  onSuccess,
}: UserSheetFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit: onSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: EMPTY_FORM,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(getInitialValues(mode, initialUser));
    setFormError(null);
  }, [open, mode, initialUser, reset]);

  const selectedRole = watch('userRole');

  useEffect(() => {
    if (!open) {
      return;
    }

    if (selectedRole === Role.Manager) {
      setValue('managerId', '');
      setValue('vendorId', '');
      return;
    }

    if (selectedRole === Role.Employee) {
      const defaultManager =
        (mode === 'edit' && initialUser?.userRole === Role.Employee
          ? initialUser.managerId
          : null) ??
        managerOptions[0]?.id ??
        '';
      const defaultVendor =
        (mode === 'edit' && initialUser?.userRole === Role.Employee
          ? initialUser.vendorId
          : null) ??
        vendorOptions[0]?.id ??
        '';

      setValue('managerId', defaultManager);
      setValue('vendorId', defaultVendor);
    }
  }, [open, selectedRole, mode, initialUser, managerOptions, vendorOptions, setValue]);

  const [createUser, { loading: creating }] = useMutation<
    Pick<Mutation, 'register'>,
    MutationRegisterArgs
  >(CREATE_USER);

  const [updateUserById, { loading: updating }] = useMutation<
    UpdateUserMutationData,
    UpdateUserMutationVariables
  >(UPDATE_USER_BY_ID);

  async function handleSubmit(values: UserFormValues) {
    try {
      const dateOfBirthIso = toIsoDateTime(values.dateOfBirth);
      const dateOfJoiningIso = toIsoDateTime(values.dateOfJoining);

      if (!dateOfBirthIso || !dateOfJoiningIso) {
        setFormError('Please provide valid dates for birth and joining.');
        return;
      }

      const commonInput = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        gender: values.gender ? (values.gender as Gender) : undefined,
        userRole: values.userRole as Role,
        phoneNumber: values.phoneNumber.trim(),
        designation: values.designation.trim(),
        dateOfBirth: dateOfBirthIso,
        dateOfJoining: dateOfJoiningIso,
        emergencyContactName: values.emergencyContactName.trim(),
        emergencyContactNumber: values.emergencyContactNumber.trim(),
        branchId: values.branchId?.trim() || undefined,
        managerId: values.managerId?.trim() || undefined,
        vendorId: values.vendorId?.trim() || undefined,
      };

      if (mode === 'edit') {
        if (!initialUser?.id) {
          setFormError('User not found for update.');
          return;
        }

        await updateUserById({
          variables: {
            id: initialUser.id,
            input: commonInput,
          },
        });
      } else {
        const input: RegisterInput = {
          ...commonInput,
          password: generateTemporaryPassword(),
        };

        await createUser({ variables: { input } });
      }
      await onSuccess?.();
      onOpenChange(false);
      reset(EMPTY_FORM);
      setFormError(null);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : mode === 'create'
            ? 'Failed to create user.'
            : 'Failed to update user.',
      );
    }
  }

  const title = mode === 'create' ? 'Create User' : 'Edit User';
  const description =
    mode === 'create' ? 'Add a new user to the system.' : 'Update user details and save changes.';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col border-l border-[var(--app-border)] bg-[var(--app-surface)] p-0 text-[var(--app-text)] sm:max-w-lg [&>button]:text-[var(--app-text)] [&>button]:hover:bg-[var(--app-surface-2)]"
      >
        <SheetHeader className="space-y-2 border-b border-[var(--app-border)] px-5 pb-4 pt-6 pr-14">
          <SheetTitle className="text-3xl font-semibold text-[var(--app-text)]">{title}</SheetTitle>
          <SheetDescription className="text-base text-[var(--app-text)]">{description}</SheetDescription>
        </SheetHeader>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit(handleSubmit)}>
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>First Name</span>
              <input
                {...register('firstName')}
                placeholder="First name"
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              />
              {errors.firstName ? (
                <p className="text-xs text-[var(--app-error)]">{errors.firstName.message}</p>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Last Name</span>
              <input
                {...register('lastName')}
                placeholder="Last name"
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              />
              {errors.lastName ? (
                <p className="text-xs text-[var(--app-error)]">{errors.lastName.message}</p>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Email</span>
              <input
                {...register('email')}
                type="email"
                placeholder="Email"
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              />
              {errors.email ? <p className="text-xs text-[var(--app-error)]">{errors.email.message}</p> : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Gender</span>
              <select
                {...register('gender')}
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              >
                <option value="">Select gender (optional)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender ? (
                <p className="text-xs text-[var(--app-error)]">{errors.gender.message}</p>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>User Role</span>
              <select
                {...register('userRole')}
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Phone Number</span>
              <input
                {...register('phoneNumber')}
                placeholder="Phone number"
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Designation</span>
              <input
                {...register('designation')}
                placeholder="Designation"
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Date Of Birth</span>
              <input
                {...register('dateOfBirth')}
                type="date"
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Date Of Joining</span>
              <input
                {...register('dateOfJoining')}
                type="date"
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Emergency Contact Name</span>
              <input
                {...register('emergencyContactName')}
                placeholder="Emergency contact name"
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Emergency Contact Number</span>
              <input
                {...register('emergencyContactNumber')}
                placeholder="Emergency contact number"
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Branch</span>
              <select
                {...register('branchId')}
                className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
              >
                <option value="">Select branch (optional)</option>
                {branchOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {selectedRole !== Role.Manager ? (
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
                <span>Manager</span>
                <select
                  {...register('managerId')}
                  className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
                >
                  <option value="">Select manager (optional)</option>
                  {managerOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {selectedRole !== Role.Manager ? (
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
                <span>Vendor</span>
                <select
                  {...register('vendorId')}
                  className="h-11 w-full rounded-xl border border-[var(--app-border)] px-3 text-sm outline-none focus:border-[var(--app-primary)]"
                >
                  <option value="">Select vendor (optional)</option>
                  {vendorOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {formError ? (
              <p className="rounded-lg border border-[color:color-mix(in_srgb,var(--app-error)_30%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] px-3 py-2 text-sm text-[var(--app-error)]">
                {formError}
              </p>
            ) : null}
          </div>

          <SheetFooter className="sticky bottom-0 mt-auto flex-col gap-2 border-t border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4 sm:flex-col sm:justify-stretch sm:space-x-0">
            <Button
              type="submit"
              disabled={creating || updating}
              className="h-11 w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] text-base font-semibold text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
            >
              {creating || updating
                ? 'Saving...'
                : mode === 'create'
                  ? 'Save Changes'
                  : 'Update Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 w-full rounded-xl border-[var(--app-border)] bg-[var(--app-surface)] text-base font-semibold text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
            >
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
