'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/app/lib/data-table/data-table';
import { ManagerPageHeader, getInitials } from '@/app/components/manager/manager-leave-shared';
import {
  getLeaveStatusColumns,
  type LeaveStatusRow,
} from '@/app/components/leaves/leave-status-columns';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';
import { useAdminLeaveData } from '@/app/hooks/useAdminLeaveData';
import { toIsoDateInput } from '@/lib/datetimeutile';

export default function AdminLeaveStatusPage() {
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [offset, setOffset] = useState(0);
  const { leaves, totalCount, usersById, loading, error } = useAdminLeaveData({
    offset,
    limit: pageSize,
    search: debouncedSearch,
    includeBranches: false,
    includeVendors: false,
  });
  const columns = useMemo(() => getLeaveStatusColumns(), []);

  const rows = useMemo(() => {
    return leaves.map((leave) => {
      const user = usersById.get(leave.userId);
      const fullName = user ? `${user.firstName} ${user.lastName}` : 'Unknown Employee';

      return {
        id: leave.id,
        fullName,
        initials: getInitials(user?.firstName, user?.lastName),
        leaveType: leave.leaveTypeDescription,
        fromDate: toIsoDateInput(leave.fromDate),
        toDate: toIsoDateInput(leave.toDate),
        days: Number(leave.totalDays),
        status: leave.status,
        reason: leave.reason,
      } as LeaveStatusRow;
    });
  }, [leaves, usersById]);

  useEffect(() => {
    setOffset(0);
  }, [debouncedSearch]);

  return (
    <div className="space-y-4">
      <ManagerPageHeader title="Leave Status" subtitle="All leave requests with current status" />

      <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="border-b border-[var(--app-border)] p-3">
          <div className="relative w-full max-w-sm">
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
          <p className="p-4 text-sm text-[var(--app-text-muted)]">Loading leave status...</p>
        ) : null}
        {error ? (
          <p className="p-4 text-sm text-[var(--app-error)]">Error loading leave status: {error.message}</p>
        ) : null}

        {!error ? (
          <div className="p-3">
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
