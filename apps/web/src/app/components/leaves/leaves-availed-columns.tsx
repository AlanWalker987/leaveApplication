'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { type DataTableFeatures } from '@/app/lib/data-table/data-table-feature';

export type LeavesAvailedRow = {
  id: string;
  fullName: string;
  initials: string;
  vendor: string;
  branch: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  approvedBy: string;
};

const columnHelper = createColumnHelper<DataTableFeatures, LeavesAvailedRow>();

export function getLeavesAvailedColumns() {
  return columnHelper.columns([
    columnHelper.display({
      id: 'employee',
      header: 'Employee',
      enableSorting: false,
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--app-primary)] text-[10px] font-semibold text-[var(--app-white)]">
              {row.initials}
            </span>
            <span>{row.fullName}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('vendor', {
      header: 'Vendor',
      enableSorting: true,
    }),
    columnHelper.accessor('branch', {
      header: 'Branch',
      enableSorting: true,
    }),
    columnHelper.accessor('leaveType', {
      header: 'Leave Type',
      enableSorting: true,
    }),
    columnHelper.accessor('fromDate', {
      header: 'From',
      enableSorting: false,
    }),
    columnHelper.accessor('toDate', {
      header: 'To',
      enableSorting: false,
    }),
    columnHelper.accessor('days', {
      header: 'Days',
      enableSorting: false,
      cell: (info) => <span className="font-semibold text-[var(--app-text)]">{info.getValue()}</span>,
    }),
    columnHelper.accessor('approvedBy', {
      header: 'Approved By',
      enableSorting: true,
    }),
  ]);
}
