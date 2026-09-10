'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { SortingState } from '@tanstack/react-table';

import {
  DELETE_BRANCH_BY_ID,
  GET_ALL_BRANCHES,
} from '@/app/graphql/admin/branches/branchOperations';
import {
  type Branch as BranchType,
  type Mutation,
  type MutationDeleteBranchByIdArgs,
} from '@/gql/graphql';
import { DataTable } from '@/app/lib/data-table/data-table';
import { getBranchColumns } from './branch-columns';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader/Loader';
import { Input } from '@/components/ui/input';
import { ConfirmActionDialog } from '@/components/dialogs/confirm-action-dialog';
import { MessagePopup } from '@/components/dialogs/message-popup';
import { CreateBranchSheet } from './sheets/create-branch-sheet';
import { EditBranchSheet } from './sheets/edit-branch-sheet';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';

type GetAllBranchesData = {
  getBranches: {
    results: BranchType[];
    totalCount: number;
  };
};

export default function Branch() {
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState<
    Pick<BranchType, 'id' | 'name' | 'code' | 'location'> | undefined
  >();
  const [branchToDelete, setBranchToDelete] = useState<
    Pick<BranchType, 'id' | 'name'> | undefined
  >();
  const [statusPopup, setStatusPopup] = useState<{
    tone: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);

  const {
    data,
    loading: allBranchesLoading,
    error: allBranchesError,
    refetch,
  } = useQuery<GetAllBranchesData>(GET_ALL_BRANCHES, {
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

  const branches = data?.getBranches.results ?? [];
  const totalCount = data?.getBranches.totalCount;

  const [deleteBranchById, { loading: deleting }] = useMutation<
    Pick<Mutation, 'deleteBranchById'>,
    MutationDeleteBranchByIdArgs
  >(DELETE_BRANCH_BY_ID);

  const columns = useMemo(
    () =>
      getBranchColumns({
        onEdit: (branch) => setSelectedBranch(branch),
        onDelete: (branch) => {
          setStatusPopup(null);
          setBranchToDelete({ id: branch.id, name: branch.name });
        },
      }),
    [],
  );

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

  async function handleMutationSuccess() {
    await refetch();
  }

  async function handleDeleteConfirm() {
    if (!branchToDelete?.id) {
      setStatusPopup({
        tone: 'warning',
        title: 'Delete Branch',
        message: 'Unable to delete branch because branch id is missing.',
      });
      return;
    }

    const branchId = branchToDelete.id;
    if (!branchId) {
      setStatusPopup({
        tone: 'warning',
        title: 'Delete Branch',
        message: 'Invalid branch id. Please refresh the page and try again.',
      });
      return;
    }

    try {
      await deleteBranchById({
        variables: {
          id: branchId,
        },
      });
      const deletedBranchName = branchToDelete.name;
      setBranchToDelete(undefined);
      await refetch();
      setStatusPopup({
        tone: 'success',
        title: 'Branch Deleted',
        message: `${deletedBranchName} was deleted successfully.`,
      });
    } catch (error) {
      setStatusPopup({
        tone: 'error',
        title: 'Delete Failed',
        message: error instanceof Error ? error.message : 'Failed to delete branch.',
      });
    }
  }

  if (allBranchesLoading && !data) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center rounded-2xl bg-[var(--app-surface)]">
        <Loader />
      </div>
    );
  }

  if (allBranchesError) {
    return <p>Error: {allBranchesError.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Branches</h1>
          <p className="text-sm text-[var(--app-text-muted)]">Manage and view all branches in the system.</p>
        </div>
        <Button className="text-md font-bold" onClick={() => setIsCreateSheetOpen(true)}>
          + Add Branch
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
            placeholder="Search by branch name"
            className="h-10 pl-11 pr-3 text-sm placeholder:text-[var(--app-text-muted)]"
          />
        </div>
        <DataTable
          columns={columns}
          data={branches}
          emptyStateText="No branches found matching the search."
          initialPageSize={pageSize}
          serverPagination={{
            offset,
            limit: pageSize,
            totalCount,
            isLoading: allBranchesLoading,
            onOffsetChange: setOffset,
            onLimitChange: setPageSize,
            onSortingChange: handleSortingChange,
          }}
        />
      </div>

      <CreateBranchSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        onSuccess={handleMutationSuccess}
      />
      <EditBranchSheet
        open={Boolean(selectedBranch)}
        branch={selectedBranch}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBranch(undefined);
          }
        }}
        onSuccess={handleMutationSuccess}
      />

      <ConfirmActionDialog
        open={Boolean(branchToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setBranchToDelete(undefined);
          }
        }}
        title="Delete Branch"
        description={`Are you sure you want to delete the branch ${branchToDelete?.name}? `}
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
