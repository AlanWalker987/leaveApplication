'use client';

import { type Branch } from '@/gql/graphql';

import { BranchSheetForm } from './branch-sheet-form';

type EditBranchSheetProps = {
  open: boolean;
  branch?: Pick<Branch, 'id' | 'name' | 'code' | 'location'>;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void> | void;
};

export function EditBranchSheet({ open, branch, onOpenChange, onSuccess }: EditBranchSheetProps) {
  return (
    <BranchSheetForm
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      initialBranch={branch}
      onSuccess={onSuccess}
    />
  );
}
