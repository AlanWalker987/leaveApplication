'use client';

import { type PublicHoliday } from '@/gql/graphql';

import { PublicHolidaySheetForm } from './public-holiday-sheet-form';

type EditPublicHolidaySheetProps = {
  open: boolean;
  publicHoliday?: PublicHoliday;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void> | void;
};

export function EditPublicHolidaySheet({
  open,
  publicHoliday,
  onOpenChange,
  onSuccess,
}: EditPublicHolidaySheetProps) {
  return (
    <PublicHolidaySheetForm
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      initialPublicHoliday={publicHoliday}
      onSuccess={onSuccess}
    />
  );
}
