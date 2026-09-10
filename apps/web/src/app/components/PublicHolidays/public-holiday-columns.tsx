'use client';

import { createColumnHelper } from '@tanstack/react-table';

import { type DataTableFeatures } from '@/app/lib/data-table/data-table-feature';
import { type PublicHoliday } from '@/gql/graphql';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toIsoDateInput } from '@/lib/datetimeutile';

const columnHelper = createColumnHelper<DataTableFeatures, PublicHoliday>();

type PublicHolidayColumnActions = {
  onEdit: (publicHoliday: PublicHoliday) => void;
  onDelete?: (publicHoliday: PublicHoliday) => void;
};

export function getPublicHolidayColumns({ onEdit, onDelete }: PublicHolidayColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor('title', {
      header: 'Title',
      enableSorting: true,
    }),
    columnHelper.accessor('holidayDate', {
      header: 'Holiday Date',
      enableSorting: true,
      cell: (info) => {
        const value = info.getValue();
        return value ? toIsoDateInput(value, '-') : '-';
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: (info) => {
        const publicHoliday = info.row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[var(--app-text)] hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]"
              aria-label={`Edit holiday ${publicHoliday.id}`}
              onClick={() => onEdit(publicHoliday)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[var(--app-error)] hover:bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] hover:text-[var(--app-error)]"
              aria-label={`Delete holiday ${publicHoliday.id}`}
              onClick={() => onDelete?.(publicHoliday)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
  ]);
}
