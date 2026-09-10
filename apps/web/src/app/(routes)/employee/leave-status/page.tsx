'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';
import { CANCEL_LEAVE_BY_ID, GET_MY_LEAVES } from '@/app/graphql/employee/employeeOperations';
import { ErrorPopup, SuccessPopup } from '@/components/dialogs/message-popup';
import { LeaveStatusBadge, type LeaveRequestStatus } from '@/app/components/employee/leave-shared';
import { PageSizeDropdown } from '@/app/components/layout/page-size-dropdown';
import { toIsoDateInput } from '@/lib/datetimeutile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type LeaveRequestRecord = {
  id: string;
  leaveType: string;
  appliedOn: string;
  duration: string;
  daysLabel: string;
  status: LeaveRequestStatus;
  comments: string;
  canCancel: boolean;
};

type GetMyLeavesQueryData = {
  getMyLeaves: {
    results: Array<{
      id: string;
      leaveTypeDescription: string;
      fromDate: string;
      toDate: string;
      totalDays: number;
      status: LeaveRequestStatus;
      comments: string | null;
      createdAt: string;
      canCancel: boolean;
    }>;
    totalCount: number;
  };
};

type CancelLeaveMutationData = {
  cancelLeaveById: {
    id: string;
    status: LeaveRequestStatus;
    canCancel: boolean;
    comments: string | null;
  };
};

type CancelLeaveMutationVariables = {
  id: string;
};

type StatusFilter = 'All' | LeaveRequestStatus;

const FILTER_ORDER: StatusFilter[] = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

export default function EmployeeLeaveStatusPage() {
  const [pageSize, setPageSize] = useState(50);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('All');
  const [offset, setOffset] = useState(0);
  const [popupState, setPopupState] = useState<{
    open: boolean;
    message: string;
    tone: 'success' | 'error';
  }>({
    open: false,
    message: '',
    tone: 'success',
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetLeaveId, setTargetLeaveId] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<GetMyLeavesQueryData>(GET_MY_LEAVES, {
    variables: { offset, limit: pageSize },
    fetchPolicy: 'cache-and-network',
  });

  const [cancelLeaveById, { loading: cancellingLeave }] = useMutation<
    CancelLeaveMutationData,
    CancelLeaveMutationVariables
  >(CANCEL_LEAVE_BY_ID);

  const requests = useMemo<LeaveRequestRecord[]>(() => {
    const rows = data?.getMyLeaves.results ?? [];

    function formatDate(value: string): string {
      return toIsoDateInput(value);
    }

    return rows.map((row) => ({
      id: row.id,
      leaveType: row.leaveTypeDescription,
      appliedOn: formatDate(row.createdAt),
      duration: `${formatDate(row.fromDate)} - ${formatDate(row.toDate)}`,
      daysLabel: `${Number(row.totalDays)}d`,
      status: row.status,
      comments: row.comments ?? '-',
      canCancel: row.canCancel,
    }));
  }, [data]);

  const counters = useMemo(() => {
    return {
      All: requests.length,
      Pending: requests.filter((request) => request.status === 'Pending').length,
      Approved: requests.filter((request) => request.status === 'Approved').length,
      Rejected: requests.filter((request) => request.status === 'Rejected').length,
      Cancelled: requests.filter((request) => request.status === 'Cancelled').length,
    };
  }, [requests]);

  const visibleRequests = useMemo(() => {
    if (activeFilter === 'All') {
      return requests;
    }

    return requests.filter((request) => request.status === activeFilter);
  }, [activeFilter, requests]);

  const showActionColumn = activeFilter === 'All' || activeFilter === 'Pending';

  const totalCount = data?.getMyLeaves.totalCount ?? 0;

  function onCancelClick(leaveId: string) {
    setPopupState((prev) => ({ ...prev, open: false }));
    setTargetLeaveId(leaveId);
    setConfirmOpen(true);
  }

  async function onCancelLeaveConfirm() {
    if (!targetLeaveId) {
      return;
    }

    setPopupState((prev) => ({ ...prev, open: false }));

    try {
      await cancelLeaveById({ variables: { id: targetLeaveId } });
      setConfirmOpen(false);
      setTargetLeaveId(null);
      await refetch();
      setPopupState({
        open: true,
        message: 'Leave request cancelled successfully and leave balance updated.',
        tone: 'success',
      });
    } catch (error) {
      setPopupState({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to cancel leave request.',
        tone: 'error',
      });
    }
  }

  return (
    <>
      {popupState.tone === 'success' ? (
        <SuccessPopup
          open={popupState.open}
          message={popupState.message}
          onClose={() => setPopupState((prev) => ({ ...prev, open: false }))}
        />
      ) : (
        <ErrorPopup
          open={popupState.open}
          message={popupState.message}
          onClose={() => setPopupState((prev) => ({ ...prev, open: false }))}
        />
      )}

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) {
            setTargetLeaveId(null);
          }
        }}
      >
        <AlertDialogContent className="max-w-md rounded-xl border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-[var(--app-text)]">
          <AlertDialogHeader className="space-y-3 text-center">
            <AlertDialogTitle className="text-xl font-bold text-[var(--app-text)]">
              Cancel Leave Request?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[var(--app-text)]">
              This will cancel your pending leave request and revert the leave count.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-2 sm:justify-center">
            <AlertDialogCancel className="rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-sm font-medium text-[var(--app-text)] hover:bg-[var(--app-surface-2)]">
              No
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-md bg-[var(--app-error)] px-4 py-2 text-sm font-semibold text-[var(--app-white)] hover:bg-[var(--app-vibrant-orange-3)]"
              onClick={onCancelLeaveConfirm}
              disabled={cancellingLeave}
            >
              {cancellingLeave ? 'Cancelling...' : 'Yes, Cancel'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="rounded-2xl bg-[var(--app-surface)] p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[var(--app-text)]">Leave Status</h1>
        <p className="mt-1 text-sm text-[var(--app-text)]">
          Track all your leave requests and their current status
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {FILTER_ORDER.map((filter) => {
            const active = filter === activeFilter;
            return (
              <button
                key={filter}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? 'bg-[var(--app-primary)] text-[var(--app-white)]'
                    : 'border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:bg-[var(--app-surface-2)]'
                }`}
                type="button"
                onClick={() => setActiveFilter(filter)}
              >
                {filter} ({counters[filter]})
              </button>
            );
          })}
        </div>
      </div>

      <section className="mt-5 overflow-x-auto rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--app-border)] text-xs uppercase tracking-wide text-[var(--app-text-muted)]">
              <th className="px-4 py-4">Request ID</th>
              <th className="px-4 py-4">Leave Type</th>
              <th className="px-4 py-4">Applied On</th>
              <th className="px-4 py-4">Duration</th>
              <th className="px-4 py-4">Days</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Comments</th>
              {showActionColumn ? <th className="px-4 py-4">Action</th> : null}
            </tr>
          </thead>
          <tbody>
            {!loading && visibleRequests.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-[var(--app-text-muted)]"
                  colSpan={showActionColumn ? 8 : 7}
                >
                  No leave requests found for this filter.
                </td>
              </tr>
            ) : null}

            {loading ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-[var(--app-text-muted)]"
                  colSpan={showActionColumn ? 8 : 7}
                >
                  Loading leave requests...
                </td>
              </tr>
            ) : null}

            {visibleRequests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-[var(--app-border)] text-xs text-[var(--app-text)]"
              >
                <td className="px-4 py-4 font-normal text-[var(--app-text)]">{request.id}</td>
                <td className="px-4 py-4 font-normal text-[var(--app-text)]">
                  {request.leaveType}
                </td>
                <td className="px-4 py-4">{request.appliedOn}</td>
                <td className="px-4 py-4">{request.duration}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-[var(--app-surface-2)] px-2 py-1 text-xs font-semibold text-[var(--app-text)]">
                    {request.daysLabel}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <LeaveStatusBadge status={request.status} />
                </td>
                <td className="max-w-[340px] px-4 py-4 text-[var(--app-text)]">
                  {request.comments}
                </td>
                {showActionColumn ? (
                  <td className="px-4 py-4">
                    {request.canCancel ? (
                      <button
                        type="button"
                        className="rounded-lg border border-[color:color-mix(in_srgb,var(--app-error)_30%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] px-3 py-1.5 text-[11px] font-semibold text-[var(--app-error)] hover:bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={cancellingLeave}
                        onClick={() => onCancelClick(request.id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--app-text-muted)]">-</span>
                    )}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-[var(--app-border)] px-4 py-3">
          <div className="flex items-center gap-3">
            <PageSizeDropdown
              value={pageSize}
              disabled={loading}
              onChange={(nextSize) => {
                setPageSize(nextSize);
                setOffset(0);
              }}
            />
            <span className="text-sm text-[var(--app-text)]">
              Showing {visibleRequests.length === 0 ? 0 : offset + 1}-
              {offset + visibleRequests.length} of {totalCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-[var(--app-border)] px-3 py-1.5 text-sm text-[var(--app-text)] hover:bg-[var(--app-surface-2)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={offset === 0 || loading}
              onClick={() => setOffset((prev) => Math.max(0, prev - pageSize))}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-md border border-[var(--app-border)] px-3 py-1.5 text-sm text-[var(--app-text)] hover:bg-[var(--app-surface-2)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading || offset + pageSize >= totalCount}
              onClick={() => setOffset((prev) => prev + pageSize)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
