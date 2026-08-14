'use client';

import { createColumnHelper } from '@tanstack/react-table';

import { type DataTableFeatures } from '@/app/lib/data-table/data-table-feature';
import { Branch } from '@/gql/graphql';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

const columnHelper = createColumnHelper<DataTableFeatures, Branch>();
export const columns = columnHelper.columns([
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
      const vendorId = info.row.original.id;

      return (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label={`Edit user ${vendorId}`}
            onClick={() => console.log('Edit user', vendorId)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
            aria-label={`Delete user ${vendorId}`}
            onClick={() => console.log('Delete user', vendorId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  }),
]);
