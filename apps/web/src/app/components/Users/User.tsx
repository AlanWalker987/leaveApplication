'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { SortingState } from '@tanstack/react-table';
import { Role, type User as UserType } from '@/gql/graphql';
import { DELETE_USER_BY_ID, GET_ALL_USERS } from '../../graphql/admin/users/userOperations';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_BRANCHES } from '../../graphql/admin/branches/branchOperations';
import { GET_ALL_VENDORS } from '../../graphql/admin/vendors/vendorOperations';
import { getUserColumns } from '../Users/user-columns';
import { DataTable } from '../../lib/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader/Loader';
import { Input } from '@/components/ui/input';
import { MessagePopup } from '@/components/dialogs/message-popup';
import { ConfirmActionDialog } from '@/components/dialogs/confirm-action-dialog';
import { CreateUserSheet } from './sheets/create-user-sheet';
import { EditUserSheet } from './sheets/edit-user-sheet';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';

type BranchRow = {
  id: string;
  name: string;
  code: string;
};

type VendorRow = {
  id: string;
  name: string;
};

type GetAllUsersData = {
  getAllUsers: {
    results: UserType[];
    totalCount: number;
  };
};

type GetAllBranchesData = {
  getBranches: {
    results: BranchRow[];
  };
};

type GetAllVendorsData = {
  getVendors: {
    results: VendorRow[];
  };
};

export default function User() {
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<Pick<
    UserType,
    'id' | 'firstName' | 'lastName'
  > | null>(null);
  const [statusPopup, setStatusPopup] = useState<{
    tone: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);
  const [deleteUserById, { loading: deletingUser }] = useMutation(DELETE_USER_BY_ID);
  const userPaginationVariables = useMemo(
    () => ({
      offset,
      limit: pageSize,
      search: debouncedSearch.trim() || undefined,
      sortBy,
      sortOrder,
    }),
    [offset, pageSize, debouncedSearch, sortBy, sortOrder],
  );
  const lookupPaginationVariables = useMemo(() => ({ offset: 0, limit: 1000 }), []);

  const {
    data,
    loading: allUsersLoading,
    error: allUsersError,
    refetch,
  } = useQuery<GetAllUsersData>(GET_ALL_USERS, {
    variables: userPaginationVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    returnPartialData: true,
  });

  const {
    data: branchData,
    loading: branchesLoading,
    error: branchesError,
  } = useQuery<GetAllBranchesData>(GET_ALL_BRANCHES, {
    variables: lookupPaginationVariables,
    fetchPolicy: 'cache-first',
    returnPartialData: true,
  });

  const {
    data: vendorData,
    loading: vendorsLoading,
    error: vendorsError,
  } = useQuery<GetAllVendorsData>(GET_ALL_VENDORS, {
    variables: lookupPaginationVariables,
    fetchPolicy: 'cache-first',
    returnPartialData: true,
  });

  const users = useMemo(() => data?.getAllUsers.results ?? [], [data]);
  const totalCount = data?.getAllUsers.totalCount;
  const selectedUser = users.find((user) => user.id === selectedUserId);
  const branches = useMemo(() => branchData?.getBranches.results ?? [], [branchData]);
  const vendors = useMemo(() => vendorData?.getVendors.results ?? [], [vendorData]);

  const branchLookup = useMemo(
    () => new Map(branches.map((branch) => [branch.id, `${branch.name} (${branch.code})`])),
    [branches],
  );
  const managerLookup = useMemo(
    () => new Map(users.map((user) => [user.id, `${user.firstName} ${user.lastName}`])),
    [users],
  );

  const branchOptions = useMemo(
    () => branches.map((branch) => ({ id: branch.id, label: `${branch.name} (${branch.code})` })),
    [branches],
  );
  const managerOptions = useMemo(
    () =>
      users
        .filter((user) => user.userRole === Role.Manager)
        .map((user) => ({ id: user.id, label: `${user.firstName} ${user.lastName}` })),
    [users],
  );
  const vendorOptions = useMemo(
    () => vendors.map((vendor) => ({ id: vendor.id, label: vendor.name })),
    [vendors],
  );

  const managerOptionLookup = useMemo(
    () => new Map(managerOptions.map((option) => [option.id, option.label])),
    [managerOptions],
  );
  const vendorOptionLookup = useMemo(
    () => new Map(vendorOptions.map((option) => [option.id, option.label])),
    [vendorOptions],
  );

  const columns = useMemo(
    () =>
      getUserColumns({
        onEdit: (user) => setSelectedUserId(user.id),
        onDelete: (user) => {
          setStatusPopup(null);
          setUserToDelete({ id: user.id, firstName: user.firstName, lastName: user.lastName });
        },
        resolveBranch: (branchId) => (branchId ? (branchLookup.get(branchId) ?? '-') : '-'),
        resolveManager: (managerId) =>
          managerId
            ? (managerOptionLookup.get(managerId) ?? managerLookup.get(managerId) ?? '-')
            : '-',
        resolveVendor: (vendorId) => (vendorId ? (vendorOptionLookup.get(vendorId) ?? '-') : '-'),
      }),
    [branchLookup, managerLookup, managerOptionLookup, vendorOptionLookup],
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
    if (!userToDelete?.id) {
      setStatusPopup({
        tone: 'warning',
        title: 'Delete User',
        message: 'Unable to delete user because user id is missing.',
      });
      return;
    }

    const fullName = `${userToDelete.firstName} ${userToDelete.lastName}`.trim();

    try {
      await deleteUserById({
        variables: {
          id: userToDelete.id,
        },
      });
      setUserToDelete(null);
      await refetch();
      setStatusPopup({
        tone: 'success',
        title: 'User Deleted',
        message: `${fullName} was deleted successfully.`,
      });
    } catch (error) {
      setStatusPopup({
        tone: 'error',
        title: 'Delete Failed',
        message: error instanceof Error ? error.message : 'Failed to delete user.',
      });
    }
  }

  const isInitialLoading =
    (!data && allUsersLoading) ||
    (!branchData && branchesLoading) ||
    (!vendorData && vendorsLoading);

  if (isInitialLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center rounded-2xl bg-[var(--app-surface)]">
        <Loader />
      </div>
    );
  }

  if (allUsersError) {
    return <p>Error: {allUsersError.message}</p>;
  }

  if (branchesError) {
    return <p>Error: {branchesError.message}</p>;
  }

  if (vendorsError) {
    return <p>Error: {vendorsError.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Users</h1>
          <p className="text-sm text-[var(--app-text-muted)]">Manage and view all users in the system.</p>
        </div>
        <Button className="text-md font-bold" onClick={() => setIsCreateSheetOpen(true)}>
          + Add User
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
            placeholder="Search by name"
            className="h-10 pl-11 pr-3 text-sm placeholder:text-[var(--app-text-muted)]"
          />
        </div>
        <DataTable
          columns={columns}
          data={users}
          emptyStateText="No users found matching the search."
          initialPageSize={pageSize}
          serverPagination={{
            offset,
            limit: pageSize,
            totalCount,
            isLoading: allUsersLoading,
            onOffsetChange: setOffset,
            onLimitChange: setPageSize,
            onSortingChange: handleSortingChange,
          }}
        />
      </div>
      <CreateUserSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        branchOptions={branchOptions}
        managerOptions={managerOptions}
        vendorOptions={vendorOptions}
        onSuccess={handleMutationSuccess}
      />

      <EditUserSheet
        open={Boolean(selectedUserId)}
        user={selectedUser}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUserId(null);
          }
        }}
        branchOptions={branchOptions}
        managerOptions={managerOptions}
        vendorOptions={vendorOptions}
        onSuccess={handleMutationSuccess}
      />

      <ConfirmActionDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setUserToDelete(null);
          }
        }}
        title="Delete User"
        description={`Are you sure you want to delete the user ${userToDelete?.firstName} ${userToDelete?.lastName}?`}
        onConfirm={handleDeleteConfirm}
        confirmLabel="Delete"
        isConfirming={deletingUser}
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
