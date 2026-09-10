'use client';

import { LeaveTypeSheetForm } from './leave-type-sheet-form';

type CreateLeaveTypeSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void> | void;
};

export function CreateLeaveTypeSheet({ open, onOpenChange, onSuccess }: CreateLeaveTypeSheetProps) {
  return (
    <LeaveTypeSheetForm
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      onSuccess={onSuccess}
    />
  );
}
