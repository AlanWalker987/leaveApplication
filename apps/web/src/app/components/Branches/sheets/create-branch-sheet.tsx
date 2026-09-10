'use client';

import { BranchSheetForm } from './branch-sheet-form';

type CreateBranchSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void> | void;
};

export function CreateBranchSheet({ open, onOpenChange, onSuccess }: CreateBranchSheetProps) {
  return (
    <BranchSheetForm open={open} onOpenChange={onOpenChange} mode="create" onSuccess={onSuccess} />
  );
}
