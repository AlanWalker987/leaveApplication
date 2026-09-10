'use client';

import { createColumnHelper } from '@tanstack/react-table';

import { type DataTableFeatures } from '@/app/lib/data-table/data-table-feature';
import { Branch } from '@/gql/graphql';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

const columnHelper = createColumnHelper<DataTableFeatures, Branch>();

type BranchColumnActions = {
  onEdit: (branch: Branch) => void;
  onDelete?: (branch: Branch) => void;
};

export function getBranchColumns({ onEdit, onDelete }: BranchColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: true,
    }),
    columnHelper.accessor('code', {
      header: 'Code',
      enableSorting: true,
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      enableSorting: true,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: (info) => {
        const branch = info.row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[var(--app-text)] hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]"
              aria-label={`Edit branch ${branch.id}`}
              onClick={() => onEdit(branch)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[var(--app-error)] hover:bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] hover:text-[var(--app-error)]"
              aria-label={`Delete branch ${branch.id}`}
              onClick={() => onDelete?.(branch)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
  ]);
}
