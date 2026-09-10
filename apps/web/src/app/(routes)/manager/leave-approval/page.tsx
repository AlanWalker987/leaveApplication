'use client';

import { useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Check, Clock3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ManagerPageHeader,
  ManagerStatusBadge,
  getInitials,
} from '@/app/components/manager/manager-leave-shared';
import { REVIEW_LEAVE_BY_ID } from '@/app/graphql/manager/managerOperations';
import { useManagerLeaveData, type ManagerLeaveStatus } from '@/app/hooks/useManagerLeaveData';
import { toIsoDateInput } from '@/lib/datetimeutile';

type ReviewLeaveMutationData = {
  reviewLeaveById: {
    id: string;
    status: 'Approved' | 'Rejected';
  };
};

const TABS: ManagerLeaveStatus[] = ['Pending', 'Approved', 'Rejected'];

export default function ManagerLeaveApprovalPage() {
  const [selectedTab, setSelectedTab] = useState<ManagerLeaveStatus>('Pending');
  const [commentsById, setCommentsById] = useState<Record<string, string>>({});
  const [activeReviewLeaveId, setActiveReviewLeaveId] = useState<string | null>(null);

  const { leaves, usersById, branchesById, vendorsById, loading, error, refetchAll } =
    useManagerLeaveData();

  const [reviewLeaveById, { loading: reviewing }] =
    useMutation<ReviewLeaveMutationData>(REVIEW_LEAVE_BY_ID);

  const filteredLeaves = useMemo(
    () => leaves.filter((leave) => leave.status === selectedTab),
    [leaves, selectedTab],
  );

  async function onReview(leaveId: string, status: 'Approved' | 'Rejected') {
    await reviewLeaveById({
      variables: {
        id: leaveId,
        status,
        comments: commentsById[leaveId]?.trim() || undefined,
      },
    });

    setActiveReviewLeaveId(null);
    await refetchAll();
  }

  return (
    <div className="space-y-4">
      <ManagerPageHeader title="Leave Approval" subtitle="Review and process leave requests" />

      <div className="inline-flex rounded-lg bg-[var(--app-surface-2)] p-1">
        {TABS.map((tab) => {
          const active = selectedTab === tab;
          const tabCount = leaves.filter((leave) => leave.status === tab).length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedTab(tab)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                active
                  ? 'bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              }`}
            >
              {tab}
              {tab === 'Pending' ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--app-warning)] px-1 text-[11px] text-[var(--app-white)]">
                  {tabCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-sm text-[var(--app-text-muted)]">Loading leave approvals...</p>
      ) : null}
      {error ? (
        <p className="text-sm text-[var(--app-error)]">
          Error loading leave approvals: {error.message}
        </p>
      ) : null}

      {!loading && !error ? (
        <div className="space-y-3">
          {filteredLeaves.map((leave) => {
            const user = usersById.get(leave.userId);
            const fullName = user ? `${user.firstName} ${user.lastName}` : 'Unknown Employee';
            const vendor = user?.vendorId ? (vendorsById.get(user.vendorId)?.name ?? '-') : '-';
            const branch = user?.branchId ? (branchesById.get(user.branchId)?.name ?? '-') : '-';

            return (
              <article
                key={leave.id}
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--app-primary)] text-xs font-semibold text-[var(--app-white)]">
                      {getInitials(user?.firstName, user?.lastName)}
                    </span>
                    <div>
                      <p className="text-xl font-semibold text-[var(--app-text)]">{fullName}</p>
                      <p className="text-sm text-[var(--app-text-muted)]">
                        {vendor} - {branch}
                      </p>
                    </div>
                  </div>
                  <ManagerStatusBadge status={leave.status} />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-4">
                  <InfoBlock label="Leave Type" value={leave.leaveTypeDescription} />
                  <InfoBlock
                    label="Duration"
                    value={`${toIsoDateInput(leave.fromDate)} - ${toIsoDateInput(leave.toDate)}`}
                  />
                  <InfoBlock label="Total Days" value={`${Number(leave.totalDays)}d`} />
                  <InfoBlock
                    label={leave.status === 'Pending' ? 'Review State' : 'Reviewed On'}
                    value={
                      leave.status === 'Pending'
                        ? 'Awaiting review'
                        : toIsoDateInput(leave.updatedAt)
                    }
                  />
                </div>

                {leave.status === 'Pending' ? (
                  <>
                    <div className="mt-2 rounded-md bg-[var(--app-surface-2)] px-3 py-2">
                      <p className="text-xs text-[var(--app-text-muted)]">Reason</p>
                      <p className="text-sm text-[var(--app-text)]">{leave.reason}</p>
                    </div>

                    {activeReviewLeaveId === leave.id ? (
                      <>
                        <Input
                          className="mt-3 h-10"
                          placeholder="Add a comment..."
                          value={commentsById[leave.id] ?? ''}
                          onChange={(event) => {
                            setCommentsById((prev) => ({
                              ...prev,
                              [leave.id]: event.target.value,
                            }));
                          }}
                        />
                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            type="button"
                            disabled={reviewing}
                            onClick={() => {
                              void onReview(leave.id, 'Approved');
                            }}
                            className="bg-[var(--app-success)] text-[var(--app-white)] hover:bg-[var(--app-primary)]"
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            type="button"
                            disabled={reviewing}
                            onClick={() => {
                              void onReview(leave.id, 'Rejected');
                            }}
                            className="bg-[var(--app-error)] text-[var(--app-white)] hover:bg-[var(--app-vibrant-orange-3)]"
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                          <button
                            type="button"
                            className="px-2 text-sm font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                            onClick={() => {
                              setActiveReviewLeaveId(null);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-8"
                          onClick={() => setActiveReviewLeaveId(leave.id)}
                        >
                          <Clock3 className="mr-1 h-3.5 w-3.5" />
                          Review
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] px-3 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          leave.status === 'Approved'
                            ? 'bg-[color:color-mix(in_srgb,var(--app-success)_16%,var(--app-bg))] text-[var(--app-success)]'
                            : 'bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] text-[var(--app-error)]'
                        }`}
                      >
                        {leave.status === 'Approved'
                          ? 'Approved by manager'
                          : 'Rejected by manager'}
                      </span>
                      <span className="text-xs text-[var(--app-text-muted)]">
                        Reviewed on {toIsoDateInput(leave.updatedAt)}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                      <div className="rounded-md bg-[var(--app-surface)] px-3 py-2">
                        <p className="text-xs text-[var(--app-text-muted)]">Reason</p>
                        <p className="text-sm text-[var(--app-text)]">{leave.reason}</p>
                      </div>

                      <div className="rounded-md bg-[var(--app-surface)] px-3 py-2">
                        <p className="text-xs text-[var(--app-text-muted)]">Manager Comment</p>
                        <p className="text-sm text-[var(--app-text)]">
                          {leave.comments?.trim() || 'No manager comment provided.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          {filteredLeaves.length === 0 ? (
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-center text-sm">
              No {selectedTab.toLowerCase()} leave requests.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

type InfoBlockProps = {
  label: string;
  value: string;
};

function InfoBlock({ label, value }: InfoBlockProps) {
  return (
    <div className="rounded-md bg-[var(--app-surface-2)] px-3 py-2">
      <p className="text-xs text-[var(--app-text-muted)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--app-text)]">{value}</p>
    </div>
  );
}
