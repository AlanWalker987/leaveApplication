'use client';

import { useMutation, useQuery } from '@apollo/client';
import { LeaveType, Mutation, MutationDeleteLeaveTypeByIdArgs } from '@/gql/graphql';
import type { SortingState } from '@tanstack/react-table';
import { DataTable } from '@/app/lib/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader/Loader';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

import { getLeaveTypeColumns } from './leave-type-columns';
import {
  DELETE_LEAVETYPE_BY_ID,
  GET_ALL_LEAVE_TYPES,
} from '@/app/graphql/admin/leaveTypes/leaveTypeOperations';
import { ConfirmActionDialog } from '@/components/dialogs/confirm-action-dialog';
import { MessagePopup } from '@/components/dialogs/message-popup';
import { CreateLeaveTypeSheet } from './sheets/create-leavetype-sheet';
import { EditLeaveTypeSheet } from './sheets/edit-leave-type-sheet';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';

type GetAllLeaveTypesData = {
  getLeaveTypes: {
    results: LeaveType[];
    totalCount: number;
  };
};

export default function LeaveTypes() {
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | undefined>();
  const [leaveTypeToDelete, setLeaveTypeToDelete] = useState<
    Pick<LeaveType, 'id' | 'code'> | undefined
  >();
  const [statusPopup, setStatusPopup] = useState<{
    tone: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);

  const [deleteLeaveTypeById, { loading: deleting }] = useMutation<
    Pick<Mutation, 'deleteLeaveTypeById'>,
    MutationDeleteLeaveTypeByIdArgs
  >(DELETE_LEAVETYPE_BY_ID);

  const columns = useMemo(
    () =>
      getLeaveTypeColumns({
        onEdit: (leaveType) => setSelectedLeaveType(leaveType),
        onDelete: (leaveType) => {
          setStatusPopup(null);
          setLeaveTypeToDelete({ id: leaveType.id, code: leaveType.code });
        },
      }),
    [],
  );

  async function handleMutationSuccess() {
    await refetch();
  }

  async function handleDeleteConfirm() {
    if (!leaveTypeToDelete?.id) {
      setStatusPopup({
        tone: 'warning',
        title: 'Delete Leave Type',
        message: 'Unable to delete leave type because leave type id is missing.',
      });
      return;
    }

    const leaveTypeId = leaveTypeToDelete.id;

    try {
      await deleteLeaveTypeById({
        variables: {
          id: leaveTypeId,
        },
      });
      const deletedLeaveTypeCode = leaveTypeToDelete.code;
      setLeaveTypeToDelete(undefined);
      await refetch();
      setStatusPopup({
        tone: 'success',
        title: 'Leave Type Deleted',
        message: `${deletedLeaveTypeCode} was deleted successfully.`,
      });
    } catch (error) {
      setStatusPopup({
        tone: 'error',
        title: 'Delete Failed',
        message: error instanceof Error ? error.message : 'Failed to delete leave type.',
      });
    }
  }
  const {
    data,
    loading: allLeaveTypesLoading,
    error: allLeaveTypesError,
    refetch,
  } = useQuery<GetAllLeaveTypesData>(GET_ALL_LEAVE_TYPES, {
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

  const leaveTypes = data?.getLeaveTypes.results ?? [];
  const totalCount = data?.getLeaveTypes.totalCount;

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

  if (allLeaveTypesLoading && !data) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center rounded-2xl bg-[var(--app-surface)]">
        <Loader />
      </div>
    );
  }

  if (allLeaveTypesError) {
    return <p>Error: {allLeaveTypesError.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Leave Types</h1>
          <p className="text-sm text-[var(--app-text-muted)]">Manage and view all leave types in the system.</p>
        </div>
        <Button className="text-md font-bold" onClick={() => setIsCreateSheetOpen(true)}>
          + Add Leave Type
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
            placeholder="Search by description"
            className="h-10 pl-11 pr-3 text-sm placeholder:text-[var(--app-text-muted)]"
          />
        </div>
        <DataTable
          columns={columns}
          data={leaveTypes}
          emptyStateText="No leave types found matching the search."
          initialPageSize={pageSize}
          serverPagination={{
            offset,
            limit: pageSize,
            totalCount,
            isLoading: allLeaveTypesLoading,
            onOffsetChange: setOffset,
            onLimitChange: setPageSize,
            onSortingChange: handleSortingChange,
          }}
        />
      </div>
      <CreateLeaveTypeSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        onSuccess={handleMutationSuccess}
      />
      <EditLeaveTypeSheet
        open={Boolean(selectedLeaveType)}
        leaveType={selectedLeaveType}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLeaveType(undefined);
          }
        }}
        onSuccess={handleMutationSuccess}
      />

      <ConfirmActionDialog
        open={Boolean(leaveTypeToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setLeaveTypeToDelete(undefined);
          }
        }}
        title="Delete Leave Type"
        description={`Are you sure you want to delete the leave type ${leaveTypeToDelete?.code}? `}
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
