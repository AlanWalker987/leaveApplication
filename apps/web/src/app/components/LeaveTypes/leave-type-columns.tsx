'use client';

import { createColumnHelper } from '@tanstack/react-table';

import { type DataTableFeatures } from '@/app/lib/data-table/data-table-feature';
import { LeaveType } from '@/gql/graphql';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

const columnHelper = createColumnHelper<DataTableFeatures, LeaveType>();
export const columns = columnHelper.columns([
  columnHelper.accessor('code', {
    header: 'Leave code',
    enableSorting: true,
  }),
  columnHelper.accessor('description', {
    header: 'Leave description',
    enableSorting: true,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: (info) => {
      const leaveTypeId = info.row.original.id;

      return (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label={`Edit user ${leaveTypeId}`}
            onClick={() => console.log('Edit user', leaveTypeId)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
            aria-label={`Delete user ${leaveTypeId}`}
            onClick={() => console.log('Delete user', leaveTypeId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  }),
]);
