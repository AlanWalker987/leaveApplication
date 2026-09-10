'use client';

import { type Vendor } from '@/gql/graphql';

import { VendorSheetForm } from './vendor-sheet-form';

type EditVendorSheetProps = {
  open: boolean;
  vendor?: Vendor;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void> | void;
};

export function EditVendorSheet({ open, vendor, onOpenChange, onSuccess }: EditVendorSheetProps) {
  return (
    <VendorSheetForm
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      initialVendor={vendor}
      onSuccess={onSuccess}
    />
  );
}
