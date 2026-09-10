'use client';

import { PublicHolidaySheetForm } from './public-holiday-sheet-form';

type CreatePublicHolidaySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void> | void;
};

export function CreatePublicHolidaySheet({
  open,
  onOpenChange,
  onSuccess,
}: CreatePublicHolidaySheetProps) {
  return (
    <PublicHolidaySheetForm
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      onSuccess={onSuccess}
    />
  );
}
