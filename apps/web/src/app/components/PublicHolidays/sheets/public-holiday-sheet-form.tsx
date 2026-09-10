'use client';

import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type Mutation,
  type PublicHoliday,
  type CreatePublicHolidayInput,
  type MutationCreatePublicHolidayArgs,
  type MutationUpdatePublicHolidayByIdArgs,
  type UpdatePublicHolidayInput,
} from '@/gql/graphql';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  publicHolidayFormSchema,
  type PublicHolidayFormValues,
} from '../schemas/publicholiday-type-schema';
import {
  CREATE_PUBLIC_HOLIDAY,
  UPDATE_PUBLIC_HOLIDAY_BY_ID,
} from '@/app/graphql/admin/publicHolidays/publicHolidayOperations';
import { toIsoDateInput, toIsoDateTime } from '@/lib/datetimeutile';

type PublicHolidaySheetFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialPublicHoliday?: PublicHoliday;
  onSuccess?: () => Promise<void> | void;
};

const EMPTY_FORM: PublicHolidayFormValues = {
  title: '',
  holidayDate: '',
};

function getInitialValues(
  mode: 'create' | 'edit',
  publicHoliday?: PublicHoliday,
): PublicHolidayFormValues {
  if (mode === 'edit' && publicHoliday) {
    return {
      title: publicHoliday.title,
      holidayDate: toIsoDateInput(publicHoliday.holidayDate),
    };
  }

  return EMPTY_FORM;
}

export function PublicHolidaySheetForm({
  open,
  onOpenChange,
  mode,
  initialPublicHoliday,
  onSuccess,
}: PublicHolidaySheetFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit: onSubmit,
    formState: { errors },
  } = useForm<PublicHolidayFormValues>({
    resolver: zodResolver(publicHolidayFormSchema),
    defaultValues: EMPTY_FORM,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(getInitialValues(mode, initialPublicHoliday));
    setFormError(null);
  }, [open, mode, initialPublicHoliday, reset]);

  const [createPublicHoliday, { loading: creating }] = useMutation<
    Pick<Mutation, 'createPublicHoliday'>,
    MutationCreatePublicHolidayArgs
  >(CREATE_PUBLIC_HOLIDAY);

  const [updatePublicHolidayById, { loading: updating }] = useMutation<
    Pick<Mutation, 'updatePublicHolidayById'>,
    MutationUpdatePublicHolidayByIdArgs
  >(UPDATE_PUBLIC_HOLIDAY_BY_ID);

  const isSubmitting = creating || updating;

  async function handleSubmit(values: PublicHolidayFormValues) {
    try {
      const holidayDateIso = toIsoDateTime(values.holidayDate);

      if (!holidayDateIso) {
        setFormError('Please provide a valid holiday date.');
        return;
      }

      const createInput: CreatePublicHolidayInput = {
        title: values.title.trim(),
        holidayDate: holidayDateIso,
      };

      if (mode === 'create') {
        await createPublicHoliday({
          variables: {
            input: createInput,
          },
        });
      } else {
        if (!initialPublicHoliday?.id) {
          setFormError('Unable to update public holiday without an id.');
          return;
        }
        const publicHolidayId = initialPublicHoliday.id;
        const updateInput: UpdatePublicHolidayInput = {
          title: createInput.title,
          holidayDate: createInput.holidayDate,
        };

        await updatePublicHolidayById({
          variables: {
            id: publicHolidayId,
            input: updateInput,
          },
        });
      }

      await onSuccess?.();
      onOpenChange(false);
      reset(EMPTY_FORM);
      setFormError(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save public holiday.');
    }
  }

  const title = mode === 'create' ? 'Create Public Holiday' : 'Edit Public Holiday';
  const description =
    mode === 'create'
      ? 'Add a new public holiday to the calendar.'
      : 'Update public holiday details and save your changes.';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col border-l border-[var(--app-border)] bg-[var(--app-surface)] p-0 text-[var(--app-text)] sm:max-w-lg [&>button]:text-[var(--app-text)] [&>button]:hover:bg-[var(--app-surface-2)]"
      >
        <SheetHeader className="space-y-2 border-b border-[var(--app-border)] px-5 pb-4 pt-6 pr-14">
          <SheetTitle className="text-3xl font-semibold text-[var(--app-text)]">{title}</SheetTitle>
          <SheetDescription className="text-base text-[var(--app-text)]">{description}</SheetDescription>
        </SheetHeader>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit(handleSubmit)}>
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Title</span>
              <input
                {...register('title')}
                placeholder="Enter holiday title"
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] outline-none transition focus:border-[var(--app-primary)]"
              />
              {errors.title ? <p className="text-xs text-[var(--app-error)]">{errors.title.message}</p> : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Holiday Date</span>
              <input
                {...register('holidayDate')}
                type="date"
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] outline-none transition focus:border-[var(--app-primary)]"
              />
              {errors.holidayDate ? (
                <p className="text-xs text-[var(--app-error)]">{errors.holidayDate.message}</p>
              ) : null}
            </label>

            {formError ? (
              <p className="rounded-lg border border-[color:color-mix(in_srgb,var(--app-error)_30%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] px-3 py-2 text-sm text-[var(--app-error)]">
                {formError}
              </p>
            ) : null}
          </div>

          <SheetFooter className="sticky bottom-0 mt-auto flex-col gap-2 border-t border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4 sm:flex-col sm:justify-stretch sm:space-x-0">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] text-base font-semibold text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Save Changes' : 'Update Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 w-full rounded-xl border-[var(--app-border)] bg-[var(--app-surface)] text-base font-semibold text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
            >
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
