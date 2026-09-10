'use client';

import { createColumnHelper } from '@tanstack/react-table';

import { type DataTableFeatures } from '@/app/lib/data-table/data-table-feature';
import { User } from '@/gql/graphql';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toIsoDateInput } from '@/lib/datetimeutile';

const columnHelper = createColumnHelper<DataTableFeatures, User>();

type UserColumnActions = {
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  resolveBranch?: (branchId?: string | null) => string;
  resolveManager?: (managerId?: string | null) => string;
  resolveVendor?: (vendorId?: string | null) => string;
};

export function getUserColumns({
  onEdit,
  onDelete,
  resolveBranch,
  resolveManager,
  resolveVendor,
}: UserColumnActions = {}) {
  return columnHelper.columns([
    columnHelper.display({
      id: 'name',
      header: 'Name',
      cell: (info) => {
        const firstName = info.row.original.firstName;
        const lastName = info.row.original.lastName;
        return `${firstName} ${lastName}`;
      },
      enableSorting: false,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      enableSorting: true,
    }),
    // columnHelper.accessor('phoneNumber', {
    //   header: 'Phone Number',
    //   enableSorting: false,
    // }),
    columnHelper.accessor('designation', {
      header: 'Designation',
      enableSorting: true,
    }),
    columnHelper.accessor('userRole', {
      header: 'Role',
      enableSorting: true,
    }),
    columnHelper.accessor('dateOfJoining', {
      header: 'Date of Joining',
      enableSorting: true,
      cell: (info) => {
        const date = info.getValue();
        return date ? toIsoDateInput(String(date), '-') : '-';
      },
    }),
    // columnHelper.accessor('dateOfBirth', {
    //   header: 'Date of Birth',
    //   enableSorting: true,
    //   cell: (info) => {
    //     const date = info.getValue();
    //     return date ? new Date(date).toLocaleDateString() : '-';
    //   },
    // }),
    columnHelper.accessor('branchId', {
      header: 'Branch',
      enableSorting: false,
      cell: (info) => resolveBranch?.(info.getValue()) ?? info.getValue() ?? '-',
    }),
    columnHelper.accessor('managerId', {
      header: 'Manager',
      enableSorting: false,
      cell: (info) => resolveManager?.(info.getValue()) ?? info.getValue() ?? '-',
    }),
    columnHelper.accessor('vendorId', {
      header: 'Vendor',
      enableSorting: false,
      cell: (info) => resolveVendor?.(info.getValue()) ?? info.getValue() ?? '-',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: (info) => {
        const user = info.row.original;

        if (!onEdit && !onDelete) {
          return <span className="text-sm text-[var(--app-text-muted)]">-</span>;
        }

        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[var(--app-text)] hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]"
              aria-label={`Edit user ${user.id}`}
              onClick={() => onEdit?.(user)}
              disabled={!onEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[var(--app-error)] hover:bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] hover:text-[var(--app-error)]"
              aria-label={`Delete user ${user.id}`}
              onClick={() => onDelete?.(user)}
              disabled={!onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
  ]);
}
