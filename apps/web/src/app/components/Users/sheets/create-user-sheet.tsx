'use client';

import { UserSheetForm } from './user-sheet-form';

type CreateUserSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchOptions: Array<{ id: string; label: string }>;
  vendorOptions: Array<{ id: string; label: string }>;
  managerOptions: Array<{ id: string; label: string }>;
  onSuccess?: () => Promise<void> | void;
};

export function CreateUserSheet({
  open,
  onOpenChange,
  branchOptions,
  vendorOptions,
  managerOptions,
  onSuccess,
}: CreateUserSheetProps) {
  return (
    <UserSheetForm
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      branchOptions={branchOptions}
      vendorOptions={vendorOptions}
      managerOptions={managerOptions}
      onSuccess={onSuccess}
    />
  );
}
