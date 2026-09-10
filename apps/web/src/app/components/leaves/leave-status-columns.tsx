'use client';

import { createColumnHelper } from '@tanstack/react-table';
import {
  ManagerStatusBadge,
  type ManagerLeaveStatus,
} from '@/app/components/manager/manager-leave-shared';
import { type DataTableFeatures } from '@/app/lib/data-table/data-table-feature';

export type LeaveStatusRow = {
  id: string;
  fullName: string;
  initials: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: ManagerLeaveStatus;
  reason: string;
};

const columnHelper = createColumnHelper<DataTableFeatures, LeaveStatusRow>();

export function getLeaveStatusColumns() {
  return columnHelper.columns([
    columnHelper.accessor('id', {
      header: 'Request ID',
      enableSorting: false,
      cell: (info) => <span className="text-[12px] text-[var(--app-text-muted)]">{info.getValue()}</span>,
    }),
    columnHelper.accessor('fullName', {
      header: 'Employee',
      enableSorting: true,
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--app-primary)] text-[10px] font-semibold text-[var(--app-white)]">
              {row.initials}
            </span>
            <span>{info.getValue()}</span>
          </div>
        );
      },
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
    columnHelper.accessor('status', {
      header: 'Status',
      enableSorting: true,
      cell: (info) => <ManagerStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('reason', {
      header: 'Reason',
      enableSorting: false,
      cell: (info) => <span className="text-[var(--app-text)]">{info.getValue()}</span>,
    }),
  ]);
}
