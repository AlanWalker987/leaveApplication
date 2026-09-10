'use client';

import { type LeaveType } from '@/gql/graphql';

import { LeaveTypeSheetForm } from './leave-type-sheet-form';

type EditLeaveTypeSheetProps = {
  open: boolean;
  leaveType?: LeaveType;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void> | void;
};

export function EditLeaveTypeSheet({
  open,
  leaveType,
  onOpenChange,
  onSuccess,
}: EditLeaveTypeSheetProps) {
  return (
    <LeaveTypeSheetForm
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      initialLeaveType={leaveType}
      onSuccess={onSuccess}
    />
  );
}
