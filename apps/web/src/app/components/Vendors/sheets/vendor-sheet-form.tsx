'use client';

import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  type Mutation,
  type Vendor,
  type CreateVendorInput,
  type MutationCreateVendorArgs,
  type MutationUpdateVendorByIdArgs,
  type UpdateVendorInput,
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
import { CREATE_VENDOR, UPDATE_VENDOR_BY_ID } from '@/app/graphql/admin/vendors/vendorOperations';
import { vendorFormSchema, type VendorFormValues } from '../schemas/vendor-form-schema';

type VendorSheetFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialVendor?: Vendor;
  onSuccess?: () => Promise<void> | void;
};

const EMPTY_FORM: VendorFormValues = {
  name: '',
  contactName: '',
  contactEmail: '',
  contactNumber: '',
};

function getInitialValues(mode: 'create' | 'edit', vendor?: Vendor): VendorFormValues {
  if (mode === 'edit' && vendor) {
    return {
      name: vendor.name,
      contactName: vendor.contactName,
      contactEmail: vendor.contactEmail,
      contactNumber: vendor.contactNumber,
    };
  }

  return EMPTY_FORM;
}

export function VendorSheetForm({
  open,
  onOpenChange,
  mode,
  initialVendor,
  onSuccess,
}: VendorSheetFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit: onSubmit,
    formState: { errors },
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: EMPTY_FORM,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(getInitialValues(mode, initialVendor));
    setFormError(null);
  }, [open, mode, initialVendor, reset]);

  const [createVendor, { loading: creating }] = useMutation<
    Pick<Mutation, 'createVendor'>,
    MutationCreateVendorArgs
  >(CREATE_VENDOR);

  const [updateVendorById, { loading: updating }] = useMutation<
    Pick<Mutation, 'updateVendorById'>,
    MutationUpdateVendorByIdArgs
  >(UPDATE_VENDOR_BY_ID);

  const isSubmitting = creating || updating;

  async function handleSubmit(values: VendorFormValues) {
    try {
      const createInput: CreateVendorInput = {
        name: values.name.trim(),
        contactName: values.contactName.trim(),
        contactEmail: values.contactEmail.trim(),
        contactNumber: values.contactNumber.trim(),
      };

      if (mode === 'create') {
        await createVendor({
          variables: {
            input: createInput,
          },
        });
      } else {
        if (!initialVendor?.id) {
          setFormError('Unable to update vendor without an id.');
          return;
        }

        const updateInput: UpdateVendorInput = {
          name: createInput.name,
          contactName: createInput.contactName,
          contactEmail: createInput.contactEmail,
          contactNumber: createInput.contactNumber,
        };

        await updateVendorById({
          variables: {
            id: initialVendor.id,
            input: updateInput,
          },
        });
      }

      await onSuccess?.();
      onOpenChange(false);
      reset(EMPTY_FORM);
      setFormError(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save vendor.');
    }
  }

  const title = mode === 'create' ? 'Create Vendor' : 'Edit Vendor';
  const description =
    mode === 'create'
      ? 'Add a new vendor to the system.'
      : 'Update vendor details and save your changes.';

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
              <span>Vendor Name</span>
              <input
                {...register('name')}
                placeholder="Enter vendor name"
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] outline-none transition focus:border-[var(--app-primary)]"
              />
              {errors.name ? <p className="text-xs text-[var(--app-error)]">{errors.name.message}</p> : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Contact Name</span>
              <input
                {...register('contactName')}
                placeholder="Enter contact name"
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] outline-none transition focus:border-[var(--app-primary)]"
              />
              {errors.contactName ? (
                <p className="text-xs text-[var(--app-error)]">{errors.contactName.message}</p>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Contact Email</span>
              <input
                {...register('contactEmail')}
                type="email"
                placeholder="Enter contact email"
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] outline-none transition focus:border-[var(--app-primary)]"
              />
              {errors.contactEmail ? (
                <p className="text-xs text-[var(--app-error)]">{errors.contactEmail.message}</p>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Contact Number</span>
              <input
                {...register('contactNumber')}
                placeholder="Enter contact number"
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] outline-none transition focus:border-[var(--app-primary)]"
              />
              {errors.contactNumber ? (
                <p className="text-xs text-[var(--app-error)]">{errors.contactNumber.message}</p>
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
