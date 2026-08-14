'use client';

import { createColumnHelper } from '@tanstack/react-table';

import { type DataTableFeatures } from '@/app/lib/data-table/data-table-feature';
import { type PublicHoliday } from '@/gql/graphql';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

const columnHelper = createColumnHelper<DataTableFeatures, PublicHoliday>();

export const columns = columnHelper.columns([
  columnHelper.accessor('title', {
    header: 'Title',
    enableSorting: true,
  }),
  columnHelper.accessor('holidayDate', {
    header: 'Holiday Date',
    enableSorting: true,
    cell: (info) => {
      const value = info.getValue();
      return value ? new Date(value).toLocaleDateString() : '-';
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: (info) => {
      const holidayId = info.row.original.id;

      return (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label={`Edit holiday ${holidayId}`}
            onClick={() => console.log('Edit holiday', holidayId)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
            aria-label={`Delete holiday ${holidayId}`}
            onClick={() => console.log('Delete holiday', holidayId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  }),
]);
