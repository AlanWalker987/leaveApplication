'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { SortingState } from '@tanstack/react-table';
import { type Mutation, type MutationDeleteVendorByIdArgs, type Vendor } from '@/gql/graphql';
import { useMutation, useQuery } from '@apollo/client';

import { DELETE_VENDOR_BY_ID, GET_ALL_VENDORS } from '../../graphql/admin/vendors/vendorOperations';
import { DataTable } from '../../lib/data-table/data-table';
import { getVendorColumns } from './vendor-columns';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button';
import { ConfirmActionDialog } from '@/components/dialogs/confirm-action-dialog';
import { MessagePopup } from '@/components/dialogs/message-popup';
import { Input } from '@/components/ui/input';
import { CreateVendorSheet } from './sheets/create-vendor-sheet';
import { EditVendorSheet } from './sheets/edit-vendor-sheet';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';

type GetAllVendorsData = {
  getVendors: {
    results: Vendor[];
    totalCount: number;
  };
};

export default function Vendors() {
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>();
  const [vendorToDelete, setVendorToDelete] = useState<Pick<Vendor, 'id' | 'name'> | undefined>();
  const [statusPopup, setStatusPopup] = useState<{
    tone: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);

  const [deleteVendorById, { loading: deleting }] = useMutation<
    Pick<Mutation, 'deleteVendorById'>,
    MutationDeleteVendorByIdArgs
  >(DELETE_VENDOR_BY_ID);

  const {
    data,
    loading: allVendorsLoading,
    error: allError,
    refetch,
  } = useQuery<GetAllVendorsData>(GET_ALL_VENDORS, {
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
      getVendorColumns({
        onEdit: (vendor) => setSelectedVendor(vendor),
        onDelete: (vendor) => {
          setStatusPopup(null);
          setVendorToDelete({ id: vendor.id, name: vendor.name });
        },
      }),
    [],
  );

  async function handleMutationSuccess() {
    await refetch();
  }

  async function handleDeleteConfirm() {
    if (!vendorToDelete?.id) {
      setStatusPopup({
        tone: 'warning',
        title: 'Delete Vendor',
        message: 'Unable to delete vendor because vendor id is missing.',
      });
      return;
    }

    try {
      await deleteVendorById({
        variables: {
          id: vendorToDelete.id,
        },
      });

      const deletedVendorName = vendorToDelete.name;
      setVendorToDelete(undefined);
      await refetch();
      setStatusPopup({
        tone: 'success',
        title: 'Vendor Deleted',
        message: `${deletedVendorName} was deleted successfully.`,
      });
    } catch (error) {
      setStatusPopup({
        tone: 'error',
        title: 'Delete Failed',
        message: error instanceof Error ? error.message : 'Failed to delete vendor.',
      });
    }
  }

  const vendors = data?.getVendors.results ?? [];
  const totalCount = data?.getVendors.totalCount;

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

  if (allVendorsLoading && !data) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center rounded-2xl bg-[var(--app-surface)]">
        <Loader />
      </div>
    );
  }

  if (allError) {
    return <p>Error: {allError.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Vendors</h1>
          <p className="text-sm text-[var(--app-text-muted)]">Manage and view all vendors in the system.</p>
        </div>
        <Button className="text-md font-bold" onClick={() => setIsCreateSheetOpen(true)}>
          + Add Vendor
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
            placeholder="Search by vendor name"
            className="h-10 pl-11 pr-3 text-sm placeholder:text-[var(--app-text-muted)]"
          />
        </div>
        <DataTable
          columns={columns}
          data={vendors}
          emptyStateText="No vendors found matching the search."
          initialPageSize={pageSize}
          serverPagination={{
            offset,
            limit: pageSize,
            totalCount,
            isLoading: allVendorsLoading,
            onOffsetChange: setOffset,
            onLimitChange: setPageSize,
            onSortingChange: handleSortingChange,
          }}
        />
      </div>
      <CreateVendorSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        onSuccess={handleMutationSuccess}
      />

      <EditVendorSheet
        open={Boolean(selectedVendor)}
        vendor={selectedVendor}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedVendor(undefined);
          }
        }}
        onSuccess={handleMutationSuccess}
      />

      <ConfirmActionDialog
        open={Boolean(vendorToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setVendorToDelete(undefined);
          }
        }}
        title="Delete Vendor"
        description={`Are you sure you want to delete the vendor ${vendorToDelete?.name}? `}
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
