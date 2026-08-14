'use client';

import { createColumnHelper } from '@tanstack/react-table';

import { type DataTableFeatures } from '@/app/lib/data-table/data-table-feature';
import { User } from '@/gql/graphql';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

const columnHelper = createColumnHelper<DataTableFeatures, User>();
export const columns = columnHelper.columns([
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
  columnHelper.accessor('phoneNumber', {
    header: 'Phone Number',
    enableSorting: false,
  }),
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
      return date ? new Date(date).toLocaleDateString() : '-';
    },
  }),
  columnHelper.accessor('dateOfBirth', {
    header: 'Date of Birth',
    enableSorting: true,
    cell: (info) => {
      const date = info.getValue();
      return date ? new Date(date).toLocaleDateString() : '-';
    },
  }),
  columnHelper.accessor('branchId', {
    header: 'Branch ID',
    enableSorting: false,
    cell: (info) => info.getValue() || '-',
  }),
  columnHelper.accessor('managerId', {
    header: 'Manager ID',
    enableSorting: false,
    cell: (info) => info.getValue() || '-',
  }),
  columnHelper.accessor('vendorId', {
    header: 'Vendor ID',
    enableSorting: false,
    cell: (info) => info.getValue() || '-',
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: (info) => {
      const userId = info.row.original.id;

      return (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label={`Edit user ${userId}`}
            onClick={() => console.log('Edit user', userId)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
            aria-label={`Delete user ${userId}`}
            onClick={() => console.log('Delete user', userId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  }),
]);
