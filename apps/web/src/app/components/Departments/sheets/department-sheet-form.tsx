'use client';

import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';

import {
  type CreateDepartmentInput,
  type Department,
  type Mutation,
  type MutationCreateDepartmentArgs,
  type MutationUpdateDepartmentByIdArgs,
  type UpdateDepartmentInput,
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
import {
  CREATE_DEPARTMENT,
  UPDATE_DEPARTMENT_BY_ID,
} from '@/app/graphql/admin/departments/departmentOperations';
import { departmentFormSchema, type DepartmentFormValues } from '../schemas/department-form-schema';

type DepartmentSheetFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialDepartment?: Pick<Department, 'id' | 'name' | 'subtitle' | 'location' | 'managerId'> & {
    employees?: Array<{ id: string; firstName: string; lastName: string }>;
  };
  branchOptions: Array<{ id: string; label: string; location: string }>;
  managerOptions: Array<{ id: string; label: string }>;
  employeeOptions: Array<{ id: string; label: string }>;
  onSuccess?: () => Promise<void> | void;
};

const EMPTY_FORM: DepartmentFormValues = {
  name: '',
  subtitle: '',
  branchId: '',
  managerId: '',
  employeeIds: [],
};

function getInitialValues(
  mode: 'create' | 'edit',
  department?: Pick<Department, 'id' | 'name' | 'subtitle' | 'location' | 'managerId'> & {
    employees?: Array<{ id: string; firstName: string; lastName: string }>;
  },
  branchOptions: Array<{ id: string; label: string; location: string }> = [],
): DepartmentFormValues {
  if (mode === 'edit' && department) {
    const matchingBranch = branchOptions.find(
      (branch) =>
        branch.location.toLowerCase() === department.location.toLowerCase() ||
        branch.label.toLowerCase() === department.location.toLowerCase(),
    );

    return {
      name: department.name,
      subtitle: department.subtitle,
      branchId: matchingBranch?.id ?? '',
      managerId: department.managerId,
      employeeIds: department.employees?.map((employee) => employee.id) ?? [],
    };
  }

  return EMPTY_FORM;
}

export function DepartmentSheetForm({
  open,
  onOpenChange,
  mode,
  initialDepartment,
  branchOptions,
  managerOptions,
  employeeOptions,
  onSuccess,
}: DepartmentSheetFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit: onSubmit,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: EMPTY_FORM,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const initialValues = getInitialValues(mode, initialDepartment, branchOptions);
    const validEmployeeIds = new Set(employeeOptions.map((employee) => employee.id));

    initialValues.employeeIds = initialValues.employeeIds.filter((employeeId) =>
      validEmployeeIds.has(employeeId),
    );

    reset(initialValues);
    setFormError(null);
    setIsEmployeeDropdownOpen(false);
  }, [open, mode, initialDepartment, branchOptions, employeeOptions, reset]);

  const selectedEmployeeIds = watch('employeeIds') ?? [];

  const [createDepartment, { loading: creating }] = useMutation<
    Pick<Mutation, 'createDepartment'>,
    MutationCreateDepartmentArgs
  >(CREATE_DEPARTMENT);

  const [updateDepartmentById, { loading: updating }] = useMutation<
    Pick<Mutation, 'updateDepartmentById'>,
    MutationUpdateDepartmentByIdArgs
  >(UPDATE_DEPARTMENT_BY_ID);

  const isSubmitting = creating || updating;

  async function handleSubmit(values: DepartmentFormValues) {
    try {
      const selectedBranch = branchOptions.find((branch) => branch.id === values.branchId);
      if (!selectedBranch) {
        setFormError('Please select a branch.');
        return;
      }

      const createInput: CreateDepartmentInput = {
        name: values.name.trim(),
        subtitle: values.subtitle.trim(),
        location: selectedBranch.location.trim(),
        managerId: values.managerId.trim(),
        employeeIds: values.employeeIds,
      };

      if (mode === 'create') {
        await createDepartment({
          variables: {
            input: createInput,
          },
        });
      } else {
        if (!initialDepartment?.id) {
          setFormError('Unable to update department without an id.');
          return;
        }

        const updateInput: UpdateDepartmentInput = {
          name: createInput.name,
          subtitle: createInput.subtitle,
          location: createInput.location,
          managerId: createInput.managerId,
          employeeIds: values.employeeIds,
        };

        await updateDepartmentById({
          variables: {
            id: initialDepartment.id,
            input: updateInput,
          },
        });
      }

      await onSuccess?.();
      onOpenChange(false);
      reset(EMPTY_FORM);
      setFormError(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save department.');
    }
  }

  const title = mode === 'create' ? 'Create Department' : 'Edit Department';
  const description =
    mode === 'create'
      ? 'Add a new department to the system.'
      : 'Update department details and save your changes.';

  function toggleEmployeeSelection(employeeId: string) {
    const hasEmployee = selectedEmployeeIds.includes(employeeId);
    const nextSelectedEmployeeIds = hasEmployee
      ? selectedEmployeeIds.filter((id) => id !== employeeId)
      : [...selectedEmployeeIds, employeeId];

    setValue('employeeIds', nextSelectedEmployeeIds, { shouldValidate: true, shouldDirty: true });
  }

  const selectedEmployeeLabel =
    selectedEmployeeIds.length === 0
      ? 'Select employees'
      : `${selectedEmployeeIds.length} employee${selectedEmployeeIds.length > 1 ? 's' : ''} selected`;

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
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Name</span>
              <input
                {...register('name')}
                placeholder="Enter department name"
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] outline-none transition focus:border-[var(--app-primary)]"
              />
              {errors.name ? <p className="text-xs text-[var(--app-error)]">{errors.name.message}</p> : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Subtitle</span>
              <input
                {...register('subtitle')}
                placeholder="Enter department subtitle"
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] outline-none transition focus:border-[var(--app-primary)]"
              />
              {errors.subtitle ? (
                <p className="text-xs text-[var(--app-error)]">{errors.subtitle.message}</p>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Branch</span>
              <select
                {...register('branchId')}
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] outline-none transition focus:border-[var(--app-primary)]"
              >
                <option value="">Select branch</option>
                {branchOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.branchId ? (
                <p className="text-xs text-[var(--app-error)]">{errors.branchId.message}</p>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Manager</span>
              <select
                {...register('managerId')}
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] outline-none transition focus:border-[var(--app-primary)]"
              >
                <option value="">Select manager</option>
                {managerOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.managerId ? (
                <p className="text-xs text-[var(--app-error)]">{errors.managerId.message}</p>
              ) : null}
            </label>

            <div className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Employees</span>
              <button
                type="button"
                onClick={() => setIsEmployeeDropdownOpen((current) => !current)}
                className="flex h-12 items-center justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-left text-base font-normal text-[var(--app-text)]"
              >
                <span className="truncate font-semibold">{selectedEmployeeLabel}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[var(--app-text-muted)] transition-transform ${
                    isEmployeeDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isEmployeeDropdownOpen ? (
                <div className="max-h-52 space-y-2 overflow-y-auto rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
                  {employeeOptions.length === 0 ? (
                    <p className="text-sm font-normal text-[var(--app-text-muted)]">No employees available.</p>
                  ) : (
                    employeeOptions.map((employee) => (
                      <label
                        key={employee.id}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm font-normal text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEmployeeIds.includes(employee.id)}
                          onChange={() => toggleEmployeeSelection(employee.id)}
                          className="h-4 w-4 rounded border-[var(--app-border)]"
                        />
                        <span>{employee.label}</span>
                      </label>
                    ))
                  )}
                </div>
              ) : null}
            </div>

            {formError ? (
              <p className="rounded-lg border border-[color:color-mix(in_srgb,var(--app-error)_30%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] px-3 py-2 text-sm text-[var(--app-error)]">
                {formError}
              </p>
            ) : null}
          </div>

          <SheetFooter className="sticky bottom-0 mt-auto flex-col gap-2 border-t border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4 sm:flex-col sm:justify-stretch sm:space-x-0">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] text-base font-semibold text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Save Changes' : 'Update Changes'}
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
