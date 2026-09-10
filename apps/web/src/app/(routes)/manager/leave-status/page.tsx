'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/app/lib/data-table/data-table';
import { ManagerPageHeader, getInitials } from '@/app/components/manager/manager-leave-shared';
import {
  getLeaveStatusColumns,
  type LeaveStatusRow,
} from '@/app/components/leaves/leave-status-columns';
import { useManagerLeaveData } from '@/app/hooks/useManagerLeaveData';
import { toIsoDateInput } from '@/lib/datetimeutile';

export default function ManagerLeaveStatusPage() {
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const { leaves, totalCount, usersById, loading, error } = useManagerLeaveData({
    offset,
    limit: pageSize,
    includeBranches: false,
    includeVendors: false,
  });
  const columns = useMemo(() => getLeaveStatusColumns(), []);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return leaves
      .map((leave) => {
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
      })
      .filter((row) => {
        if (!term) {
          return true;
        }

        return (
          row.id.toLowerCase().includes(term) ||
          row.fullName.toLowerCase().includes(term) ||
          row.leaveType.toLowerCase().includes(term) ||
          row.reason.toLowerCase().includes(term) ||
          row.status.toLowerCase().includes(term)
        );
      });
  }, [leaves, search, usersById]);

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
              placeholder="Search..."
              className="h-10 pl-11 pr-3 text-sm placeholder:text-[var(--app-text-muted)]"
            />
          </div>
        </div>

        {loading ? <p className="p-4 text-sm text-[var(--app-text-muted)]">Loading leave status...</p> : null}
        {error ? (
          <p className="p-4 text-sm text-[var(--app-error)]">Error loading leave status: {error.message}</p>
        ) : null}

        {!loading && !error ? (
          <div className="p-3">
            <DataTable
              columns={columns}
              data={rows}
              emptyStateText="No leave requests found."
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
