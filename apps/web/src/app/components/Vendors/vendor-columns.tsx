'use client';

import { createColumnHelper } from '@tanstack/react-table';

import { type DataTableFeatures } from '@/app/lib/data-table/data-table-feature';
import { Vendor } from '@/gql/graphql';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

const columnHelper = createColumnHelper<DataTableFeatures, Vendor>();

type VendorColumnActions = {
  onEdit: (vendor: Vendor) => void;
  onDelete?: (vendor: Vendor) => void;
};

export function getVendorColumns({ onEdit, onDelete }: VendorColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: true,
    }),
    columnHelper.accessor('contactName', {
      header: 'Contact Name',
      enableSorting: true,
    }),
    columnHelper.accessor('contactEmail', {
      header: 'Contact Email',
      enableSorting: false,
    }),
    columnHelper.accessor('contactNumber', {
      header: 'Contact Number',
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: (info) => {
        const vendor = info.row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[var(--app-text)] hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]"
              aria-label={`Edit vendor ${vendor.id}`}
              onClick={() => onEdit(vendor)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[var(--app-error)] hover:bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] hover:text-[var(--app-error)]"
              aria-label={`Delete vendor ${vendor.id}`}
              onClick={() => onDelete?.(vendor)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
  ]);
}
