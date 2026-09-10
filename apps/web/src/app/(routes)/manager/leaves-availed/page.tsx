'use client';

import { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/app/lib/data-table/data-table';
import { ManagerPageHeader, getInitials } from '@/app/components/manager/manager-leave-shared';
import {
  getLeavesAvailedColumns,
  type LeavesAvailedRow,
} from '@/app/components/leaves/leaves-availed-columns';
import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { useManagerLeaveData } from '@/app/hooks/useManagerLeaveData';
import { toIsoDateInput } from '@/lib/datetimeutile';

export default function ManagerLeavesAvailedPage() {
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const { user: currentUser } = useCurrentUser();
  const { leaves, totalCount, usersById, branchesById, vendorsById, loading, error } =
    useManagerLeaveData({
      status: 'Approved',
      offset,
      limit: pageSize,
    });
  const columns = useMemo(() => getLeavesAvailedColumns(), []);

  console.log({ currentUser });
  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const currentManagerName = currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : null;

    return leaves
      .map((leave) => {
        const user = usersById.get(leave.userId);
        const approver = leave.managerId ? usersById.get(leave.managerId) : null;
        const fullName = user ? `${user.firstName} ${user.lastName}` : 'Unknown Employee';
        const vendor = user?.vendorId ? (vendorsById.get(user.vendorId)?.name ?? '-') : '-';
        const branch = user?.branchId ? (branchesById.get(user.branchId)?.name ?? '-') : '-';
        const approvedBy = approver
          ? `${approver.firstName} ${approver.lastName}`
          : (currentManagerName ?? 'Manager');

        return {
          id: leave.id,
          fullName,
          initials: getInitials(user?.firstName, user?.lastName),
          vendor,
          branch,
          leaveType: leave.leaveTypeDescription,
          fromDate: toIsoDateInput(leave.fromDate),
          toDate: toIsoDateInput(leave.toDate),
          days: Number(leave.totalDays),
          approvedBy,
        } as LeavesAvailedRow;
      })
      .filter((row) => {
        if (!term) {
          return true;
        }

        return (
          row.fullName.toLowerCase().includes(term) ||
          row.vendor.toLowerCase().includes(term) ||
          row.branch.toLowerCase().includes(term) ||
          row.leaveType.toLowerCase().includes(term)
        );
      });
  }, [branchesById, currentUser, leaves, search, usersById, vendorsById]);

  return (
    <div className="space-y-4">
      <ManagerPageHeader
        title="Leaves Availed"
        subtitle="All approved leave records"
        action={
          <Button
            className="bg-[var(--app-primary)] text-[var(--app-white)] hover:bg-[var(--app-electric-blue-3)]"
            type="button"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="border-b border-[var(--app-border)] p-3 sm:p-4">
          <div className="relative w-full max-w-md">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)]">
              <Search className="h-4 w-4" />
            </span>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="h-10 pl-11 pr-3 text-sm placeholder:text-[var(--app-text-muted)]"
            />
          </div>
        </div>

        {loading ? <p className="p-4 text-sm text-[var(--app-text-muted)]">Loading approved leaves...</p> : null}
        {error ? (
          <p className="p-4 text-sm text-[var(--app-error)]">Error loading leaves: {error.message}</p>
        ) : null}

        {!loading && !error ? (
          <div className="p-3 sm:p-4">
            <DataTable
              columns={columns}
              data={rows}
              emptyStateText="No approved leave records found."
              serverPagination={{
                offset,
                limit: pageSize,
                totalCount,
                isLoading: loading,
                onOffsetChange: setOffset,
                onLimitChange: setPageSize,
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
