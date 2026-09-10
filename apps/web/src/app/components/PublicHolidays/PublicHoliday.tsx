'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Search } from 'lucide-react';
import type { SortingState } from '@tanstack/react-table';

import {
  type Mutation,
  type MutationDeletePublicHolidayByIdArgs,
  type PublicHoliday as PublicHolidayType,
} from '@/gql/graphql';
import { DataTable } from '@/app/lib/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader/Loader';
import { ConfirmActionDialog } from '@/components/dialogs/confirm-action-dialog';
import { MessagePopup } from '@/components/dialogs/message-popup';
import { Input } from '@/components/ui/input';
import {
  DELETE_PUBLIC_HOLIDAY_BY_ID,
  GET_ALL_PUBLIC_HOLIDAYS,
} from '@/app/graphql/admin/publicHolidays/publicHolidayOperations';

import { getPublicHolidayColumns } from './public-holiday-columns';
import { CreatePublicHolidaySheet } from './sheets/create-public-holiday-sheet';
import { EditPublicHolidaySheet } from './sheets/edit-public-holiday-sheet';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';

type GetAllPublicHolidaysData = {
  getPublicHolidays: {
    results: PublicHolidayType[];
    totalCount: number;
  };
};

export default function PublicHoliday() {
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedPublicHoliday, setSelectedPublicHoliday] = useState<
    PublicHolidayType | undefined
  >();
  const [publicHolidayToDelete, setPublicHolidayToDelete] = useState<
    Pick<PublicHolidayType, 'id' | 'title'> | undefined
  >();
  const [statusPopup, setStatusPopup] = useState<{
    tone: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);

  const [deletePublicHolidayById, { loading: deleting }] = useMutation<
    Pick<Mutation, 'deletePublicHolidayById'>,
    MutationDeletePublicHolidayByIdArgs
  >(DELETE_PUBLIC_HOLIDAY_BY_ID);

  const {
    data,
    loading: allPublicHolidayLoading,
    error: allPublicHolidayError,
    refetch,
  } = useQuery<GetAllPublicHolidaysData>(GET_ALL_PUBLIC_HOLIDAYS, {
    variables: {
      offset,
      limit: pageSize,
      search: debouncedSearch.trim() || undefined,
      sortBy,
      sortOrder,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    returnPartialData: true,
  });

  const columns = useMemo(
    () =>
      getPublicHolidayColumns({
        onEdit: (publicHoliday) => setSelectedPublicHoliday(publicHoliday),
        onDelete: (publicHoliday) => {
          setStatusPopup(null);
          setPublicHolidayToDelete({ id: publicHoliday.id, title: publicHoliday.title });
        },
      }),
    [],
  );

  async function handleMutationSuccess() {
    await refetch();
  }

  async function handleDeleteConfirm() {
    if (!publicHolidayToDelete?.id) {
      setStatusPopup({
        tone: 'warning',
        title: 'Delete Public Holiday',
        message: 'Unable to delete public holiday because holiday id is missing.',
      });
      return;
    }

    try {
      await deletePublicHolidayById({
        variables: {
          id: publicHolidayToDelete.id,
        },
      });
      const deletedHolidayTitle = publicHolidayToDelete.title;
      setPublicHolidayToDelete(undefined);
      await refetch();
      setStatusPopup({
        tone: 'success',
        title: 'Public Holiday Deleted',
        message: `${deletedHolidayTitle} was deleted successfully.`,
      });
    } catch (error) {
      setStatusPopup({
        tone: 'error',
        title: 'Delete Failed',
        message: error instanceof Error ? error.message : 'Failed to delete public holiday.',
      });
    }
  }

  const holidays = data?.getPublicHolidays.results ?? [];
  const totalCount = data?.getPublicHolidays.totalCount;

  useEffect(() => {
    setOffset(0);
  }, [debouncedSearch]);

  function handleSortingChange(sorting: SortingState) {
    const [primarySort] = sorting;

    setOffset(0);
    if (!primarySort) {
      setSortBy(undefined);
      setSortOrder(undefined);
      return;
    }

    setSortBy(String(primarySort.id));
    setSortOrder(primarySort.desc ? 'desc' : 'asc');
  }

  if (allPublicHolidayLoading && !data) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center rounded-2xl bg-[var(--app-surface)]">
        <Loader />
      </div>
    );
  }

  if (allPublicHolidayError) {
    return <p>Error: {allPublicHolidayError.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Public Holidays</h1>
          <p className="text-sm text-[var(--app-text-muted)]">Manage and view all holidays for the year.</p>
        </div>
        <Button className="text-md font-bold" onClick={() => setIsCreateSheetOpen(true)}>
          + Add Holiday
        </Button>
      </div>
      <div className="w-full">
        <div className="mb-3 relative w-full max-w-md">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)]">
            <Search className="h-4 w-4" />
          </span>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title"
            className="h-10 pl-11 pr-3 text-sm placeholder:text-[var(--app-text-muted)]"
          />
        </div>
        <DataTable
          columns={columns}
          data={holidays}
          emptyStateText="No public holidays found matching the search."
          initialPageSize={pageSize}
          serverPagination={{
            offset,
            limit: pageSize,
            totalCount,
            isLoading: allPublicHolidayLoading,
            onOffsetChange: setOffset,
            onLimitChange: setPageSize,
            onSortingChange: handleSortingChange,
          }}
        />
      </div>
      <CreatePublicHolidaySheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        onSuccess={handleMutationSuccess}
      />

      <EditPublicHolidaySheet
        open={Boolean(selectedPublicHoliday)}
        publicHoliday={selectedPublicHoliday}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPublicHoliday(undefined);
          }
        }}
        onSuccess={handleMutationSuccess}
      />

      <ConfirmActionDialog
        open={Boolean(publicHolidayToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPublicHolidayToDelete(undefined);
          }
        }}
        title="Delete Public Holiday"
        description={`Are you sure you want to delete the public holiday ${publicHolidayToDelete?.title}? `}
        onConfirm={handleDeleteConfirm}
        confirmLabel="Delete"
        isConfirming={deleting}
        pendingLabel="Deleting..."
      />

      {statusPopup ? (
        <MessagePopup
          open
          tone={statusPopup.tone}
          title={statusPopup.title}
          message={statusPopup.message}
          onClose={() => setStatusPopup(null)}
        />
      ) : null}
    </div>
  );
}
