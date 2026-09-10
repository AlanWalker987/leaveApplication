'use client';

import { DepartmentSheetForm } from './department-sheet-form';

type CreateDepartmentSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchOptions: Array<{ id: string; label: string; location: string }>;
  managerOptions: Array<{ id: string; label: string }>;
  employeeOptions: Array<{ id: string; label: string }>;
  onSuccess?: () => Promise<void> | void;
};

export function CreateDepartmentSheet({
  open,
  onOpenChange,
  branchOptions,
  managerOptions,
  employeeOptions,
  onSuccess,
}: CreateDepartmentSheetProps) {
  return (
    <DepartmentSheetForm
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      branchOptions={branchOptions}
      managerOptions={managerOptions}
      employeeOptions={employeeOptions}
      onSuccess={onSuccess}
    />
  );
}
