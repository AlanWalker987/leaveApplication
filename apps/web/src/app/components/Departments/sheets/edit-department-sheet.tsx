'use client';

import { type Department } from '@/gql/graphql';

import { DepartmentSheetForm } from './department-sheet-form';

type EditDepartmentSheetProps = {
  open: boolean;
  department?: Pick<Department, 'id' | 'name' | 'subtitle' | 'location' | 'managerId'> & {
    employees?: Array<{ id: string; firstName: string; lastName: string }>;
  };
  onOpenChange: (open: boolean) => void;
  branchOptions: Array<{ id: string; label: string; location: string }>;
  managerOptions: Array<{ id: string; label: string }>;
  employeeOptions: Array<{ id: string; label: string }>;
  onSuccess?: () => Promise<void> | void;
};

export function EditDepartmentSheet({
  open,
  department,
  onOpenChange,
  branchOptions,
  managerOptions,
  employeeOptions,
  onSuccess,
}: EditDepartmentSheetProps) {
  return (
    <DepartmentSheetForm
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      initialDepartment={department}
      branchOptions={branchOptions}
      managerOptions={managerOptions}
      employeeOptions={employeeOptions}
      onSuccess={onSuccess}
    />
  );
}
