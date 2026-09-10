'use client';

import { type User } from '@/gql/graphql';
import { UserSheetForm } from './user-sheet-form';

type EditUserSheetProps = {
  open: boolean;
  user?: User;
  onOpenChange: (open: boolean) => void;
  branchOptions: Array<{ id: string; label: string }>;
  vendorOptions: Array<{ id: string; label: string }>;
  managerOptions: Array<{ id: string; label: string }>;
  onSuccess?: () => Promise<void> | void;
};

export function EditUserSheet({
  open,
  user,
  onOpenChange,
  branchOptions,
  vendorOptions,
  managerOptions,
  onSuccess,
}: EditUserSheetProps) {
  return (
    <UserSheetForm
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      initialUser={user}
      branchOptions={branchOptions}
      vendorOptions={vendorOptions}
      managerOptions={managerOptions}
      onSuccess={onSuccess}
    />
  );
}
