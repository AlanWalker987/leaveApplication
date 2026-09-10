'use client';

import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_MY_LEAVES } from '@/app/graphql/employee/employeeOperations';
import {
  LeaveHistoryStatCard,
  LeaveStatusBadge,
  type LeaveRequestStatus,
} from '@/app/components/employee/leave-shared';
import { compareIsoDateDesc, toIsoDateInput } from '@/lib/datetimeutile';

type GetMyLeavesQueryData = {
  getMyLeaves: {
    results: Array<{
      id: string;
      leaveTypeDescription: string;
      fromDate: string;
      toDate: string;
      totalDays: number;
      status: LeaveRequestStatus;
      createdAt: string;
      comments: string | null;
    }>;
  };
};

export default function EmployeeLeaveHistoryPage() {
  const { data, loading, error } = useQuery<GetMyLeavesQueryData>(GET_MY_LEAVES, {
    variables: { offset: 0, limit: 300 },
    fetchPolicy: 'cache-and-network',
  });

  const records = useMemo(() => {
    const rows = data?.getMyLeaves.results ?? [];
    return [...rows].sort((a, b) => compareIsoDateDesc(a.createdAt, b.createdAt));
  }, [data]);

  function formatDate(value: string): string {
    return toIsoDateInput(value);
  }

  const stats = useMemo(
    () => ({
      total: records.length,
      approved: records.filter((record) => record.status === 'Approved').length,
      rejected: records.filter((record) => record.status === 'Rejected').length,
      cancelled: records.filter((record) => record.status === 'Cancelled').length,
    }),
    [records],
  );

  return (
    <div className="space-y-4">
      <header className="rounded-2xl bg-[var(--app-surface)] p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-[var(--app-text)]">Leave History</h1>
        <p className="mt-1 text-xs text-[var(--app-text-muted)]">Complete timeline of your leave activity</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <LeaveHistoryStatCard label="Total Applied" value={stats.total} />
          <LeaveHistoryStatCard
            label="Approved"
            value={stats.approved}
            valueClassName="text-[var(--app-success)]"
          />
          <LeaveHistoryStatCard
            label="Rejected"
            value={stats.rejected}
            valueClassName="text-[var(--app-error)]"
          />
          <LeaveHistoryStatCard
            label="Cancelled"
            value={stats.cancelled}
            valueClassName="text-[var(--app-text)]"
          />
        </div>
      </header>

      {loading ? (
        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-text-muted)]">
          Loading leave history...
        </section>
      ) : null}

      {error ? (
        <section className="rounded-2xl border border-[color:color-mix(in_srgb,var(--app-error)_30%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] p-6 text-sm text-[var(--app-error)]">
          Failed to load leave history: {error.message}
        </section>
      ) : null}

      {!loading && !error && records.length === 0 ? (
        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-text-muted)]">
          No leave history available yet.
        </section>
      ) : null}

      {!loading && !error
        ? records.map((record) => (
            <article
              key={record.id}
              className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--app-border)] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-[var(--app-text)]">
                      {record.leaveTypeDescription}
                    </p>
                    <LeaveStatusBadge status={record.status} />
                  </div>
                  <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                    {formatDate(record.fromDate)} {' - '} {formatDate(record.toDate)} {'  '} •{' '}
                    {'  '}
                    {Number(record.totalDays)} day{Number(record.totalDays) > 1 ? 's' : ''}
                  </p>
                </div>
                <p className="text-xs font-semibold tracking-wide text-[var(--app-text-muted)]">{record.id}</p>
              </div>

              <div className="mt-3 space-y-2 text-xs text-[var(--app-text)]">
                <p>
                  <span className="font-semibold text-[var(--app-text)]">Applied by You</span> at{' '}
                  {formatDate(record.createdAt)}
                </p>
                <p>
                  <span className="font-semibold text-[var(--app-text)]">{record.status}</span>{' '}
                  {record.status === 'Cancelled' ? 'by You' : 'by Manager'}
                </p>
                {record.comments ? (
                  <p className="text-[var(--app-text-muted)]">Comment: {record.comments}</p>
                ) : null}
              </div>
            </article>
          ))
        : null}
    </div>
  );
}
