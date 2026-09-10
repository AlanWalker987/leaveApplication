'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/app/lib/data-table/data-table';
import { ManagerPageHeader, getInitials } from '@/app/components/manager/manager-leave-shared';
import {
  getLeavesAvailedColumns,
  type LeavesAvailedRow,
} from '@/app/components/leaves/leaves-availed-columns';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';
import { useAdminLeaveData } from '@/app/hooks/useAdminLeaveData';
import { toIsoDateInput } from '@/lib/datetimeutile';

export default function AdminLeavesAvailedPage() {
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [offset, setOffset] = useState(0);
  const { leaves, totalCount, usersById, branchesById, vendorsById, loading, error } =
    useAdminLeaveData({
      status: 'Approved',
      offset,
      limit: pageSize,
      search: debouncedSearch,
    });
  const columns = useMemo(() => getLeavesAvailedColumns(), []);

  const rows = useMemo(() => {
    return leaves.map((leave) => {
      const user = usersById.get(leave.userId);
      const approver = leave.managerId ? usersById.get(leave.managerId) : null;
      const fullName = user ? `${user.firstName} ${user.lastName}` : 'Unknown Employee';
      const vendor = user?.vendorId ? (vendorsById.get(user.vendorId)?.name ?? '-') : '-';
      const branch = user?.branchId ? (branchesById.get(user.branchId)?.name ?? '-') : '-';
      const approvedBy = approver ? `${approver.firstName} ${approver.lastName}` : 'Manager';

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
    });
  }, [branchesById, leaves, usersById, vendorsById]);

  useEffect(() => {
    setOffset(0);
  }, [debouncedSearch]);

  return (
    <div className="space-y-4">
      <ManagerPageHeader title="Leaves Availed" subtitle="All approved leave records" />

      <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="border-b border-[var(--app-border)] p-3 sm:p-4">
          <div className="relative w-full max-w-md">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)]">
              <Search className="h-4 w-4" />
            </span>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by employee name"
              className="h-10 pl-11 pr-3 text-sm placeholder:text-[var(--app-text-muted)]"
            />
          </div>
        </div>

        {loading && rows.length === 0 ? (
          <p className="p-4 text-sm text-[var(--app-text-muted)]">Loading approved leaves...</p>
        ) : null}
        {error ? (
          <p className="p-4 text-sm text-[var(--app-error)]">
            Error loading leaves: {error.message}
          </p>
        ) : null}

        {!error ? (
          <div className="p-3 sm:p-4">
            <DataTable
              columns={columns}
              data={rows}
              emptyStateText="No results found for employee name."
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
