'use client';

import { VendorSheetForm } from './vendor-sheet-form';

type CreateVendorSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void> | void;
};

export function CreateVendorSheet({ open, onOpenChange, onSuccess }: CreateVendorSheetProps) {
  return (
    <VendorSheetForm open={open} onOpenChange={onOpenChange} mode="create" onSuccess={onSuccess} />
  );
}
