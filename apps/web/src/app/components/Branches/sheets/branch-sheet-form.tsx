'use client';

import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  CREATE_BRANCH,
  UPDATE_BRANCH_BY_ID,
  DELETE_BRANCH_BY_ID,
} from '@/app/graphql/admin/branches/branchOperations';
import {
  type Branch,
  type CreateBranchInput,
  type UpdateBranchInput,
  type Mutation,
  type MutationCreateBranchArgs,
  type MutationUpdateBranchByIdArgs,
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
import { branchFormSchema, type BranchFormValues } from '../schemas/branch-form-schemas';

type BranchSheetFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialBranch?: Pick<Branch, 'id' | 'name' | 'code' | 'location'>;
  onSuccess?: () => Promise<void> | void;
};

const EMPTY_FORM: BranchFormValues = {
  name: '',
  code: '',
  location: '',
};

function getInitialValues(
  mode: 'create' | 'edit',
  branch?: Pick<Branch, 'id' | 'name' | 'code' | 'location'>,
): BranchFormValues {
  if (mode === 'edit' && branch) {
    return {
      name: branch.name,
      code: branch.code,
      location: branch.location,
    };
  }

  return EMPTY_FORM;
}

export function BranchSheetForm({
  open,
  onOpenChange,
  mode,
  initialBranch,
  onSuccess,
}: BranchSheetFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit: onSubmit,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: EMPTY_FORM,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(getInitialValues(mode, initialBranch));
    setFormError(null);
  }, [open, mode, initialBranch, reset]);

  const [createBranch, { loading: creating }] = useMutation<
    Pick<Mutation, 'createBranch'>,
    MutationCreateBranchArgs
  >(CREATE_BRANCH);

  const [updateBranchById, { loading: updating }] = useMutation<
    Pick<Mutation, 'updateBranchById'>,
    MutationUpdateBranchByIdArgs
  >(UPDATE_BRANCH_BY_ID);

  const isSubmitting = creating || updating;

  async function handleSubmit(values: BranchFormValues) {
    try {
      const createInput: CreateBranchInput = {
        name: values.name.trim(),
        code: values.code.trim(),
        location: values.location.trim(),
      };

      if (mode === 'create') {
        await createBranch({
          variables: {
            input: createInput,
          },
        });
      } else {
        if (!initialBranch?.id) {
          setFormError('Unable to update branch without an id.');
          return;
        }
        const branchId = initialBranch.id;
        const updateInput: UpdateBranchInput = {
          name: createInput.name,
          code: createInput.code,
          location: createInput.location,
        };

        await updateBranchById({
          variables: {
            id: branchId,
            input: updateInput,
          },
        });
      }

      await onSuccess?.();
      onOpenChange(false);
      reset(EMPTY_FORM);
      setFormError(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save branch.');
    }
  }

  const title = mode === 'create' ? 'Create Branch' : 'Edit Branch';
  const description =
    mode === 'create'
      ? 'Add a new branch to the system.'
      : 'Update branch details and save your changes.';

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
              <span>Name</span>
              <input
                {...register('name')}
                placeholder="Enter branch name"
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] outline-none transition focus:border-[var(--app-primary)]"
              />
              {errors.name ? <p className="text-xs text-[var(--app-error)]">{errors.name.message}</p> : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Code</span>
              <input
                {...register('code')}
                placeholder="Enter branch code"
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] outline-none transition focus:border-[var(--app-primary)]"
              />
              {errors.code ? <p className="text-xs text-[var(--app-error)]">{errors.code.message}</p> : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--app-text)]">
              <span>Location</span>
              <input
                {...register('location')}
                placeholder="Enter branch location"
                className="h-12 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] outline-none transition focus:border-[var(--app-primary)]"
              />
              {errors.location ? (
                <p className="text-xs text-[var(--app-error)]">{errors.location.message}</p>
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
