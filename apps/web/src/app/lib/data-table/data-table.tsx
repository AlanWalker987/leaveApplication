'use client';

import * as React from 'react';
import { useTable, type ColumnDef, type RowData, type SortingState } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { PageSizeDropdown } from '@/app/components/layout/page-size-dropdown';
import { Button } from '@/components/ui/button';
import { features, type DataTableFeatures } from './data-table-feature';

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  emptyStateText?: string;
  initialPageSize?: number;
  serverPagination?: {
    offset: number;
    limit: number;
    totalCount?: number;
    isLoading?: boolean;
    onOffsetChange: (offset: number) => void;
    onLimitChange?: (limit: number) => void;
    onSortingChange?: (sorting: SortingState) => void;
  };
}

const SERVER_PAGE_SIZE_OPTIONS = [50, 100, 150, 200] as const;

export function DataTable<TData extends RowData>({
  columns,
  data,
  emptyStateText = 'No users found.',
  initialPageSize = 10,
  serverPagination,
}: DataTableProps<TData>) {
  const isServerPagination = Boolean(serverPagination);
  const effectivePageSize = isServerPagination ? (serverPagination?.limit ?? 50) : initialPageSize;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: effectivePageSize,
  });

  React.useEffect(() => {
    if (!isServerPagination) {
      return;
    }

    setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: effectivePageSize }));
  }, [effectivePageSize, isServerPagination]);

  React.useEffect(() => {
    if (!isServerPagination || !serverPagination?.onSortingChange) {
      return;
    }

    serverPagination.onSortingChange(sorting);
  }, [isServerPagination, serverPagination, sorting]);

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualSorting: isServerPagination,
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm overflow-visible">
        <div className="relative z-0 overflow-x-auto overflow-y-auto max-h-[70vh]">
          <Table className="w-full">
            <TableHeader className="bg-[var(--app-surface-2)] sticky top-0 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b bg-[var(--app-surface-2)]">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="px-4 py-3 text-left font-semibold text-[var(--app-text)] bg-[var(--app-surface-2)]"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-2 cursor-pointer select-none hover:text-[var(--app-text)]"
                          >
                            <table.FlexRender header={header} />
                            {header.column.getCanSort() && (
                              <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0 text-[var(--app-text-muted)]" />
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="border-b hover:bg-[var(--app-surface-2)] transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3 text-[var(--app-text)]">
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-[var(--app-text-muted)]">
                    {emptyStateText}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        {isServerPagination && serverPagination ? (
          <>
            <div className="flex items-center gap-3 text-sm text-[var(--app-text)]">
              <PageSizeDropdown
                value={serverPagination.limit}
                options={[...SERVER_PAGE_SIZE_OPTIONS]}
                disabled={Boolean(serverPagination.isLoading) || !serverPagination.onLimitChange}
                onChange={(nextLimit) => {
                  serverPagination.onLimitChange?.(nextLimit);
                  serverPagination.onOffsetChange(0);
                }}
              />
              <span>
                Showing {data.length === 0 ? 0 : serverPagination.offset + 1}-
                {serverPagination.offset + data.length}
                {typeof serverPagination.totalCount === 'number'
                  ? ` of ${serverPagination.totalCount}`
                  : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  serverPagination.onOffsetChange(
                    Math.max(0, serverPagination.offset - serverPagination.limit),
                  )
                }
                disabled={serverPagination.offset === 0 || Boolean(serverPagination.isLoading)}
                className="text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  serverPagination.onOffsetChange(serverPagination.offset + serverPagination.limit)
                }
                disabled={
                  Boolean(serverPagination.isLoading) ||
                  (typeof serverPagination.totalCount === 'number'
                    ? serverPagination.offset + serverPagination.limit >=
                      serverPagination.totalCount
                    : data.length < serverPagination.limit)
                }
                className="text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-[var(--app-text)]">
              Page {pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
