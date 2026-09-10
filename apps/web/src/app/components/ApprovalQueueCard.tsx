'use client';

import { Button } from '@/components/ui/button';

type ApprovalQueueItem = {
  id?: string;
  username: string;
  requestType: string;
  requestDate: string;
  numberOfDays: number;
};

type ApprovalQueueCardItemsProps = {
  items: ApprovalQueueItem[];
  onApprove?: (item: ApprovalQueueItem) => void;
  onReject?: (item: ApprovalQueueItem) => void;
};

type ApprovalQueueCardProps = {
  items?: ApprovalQueueItem[];
  onApprove?: (item: ApprovalQueueItem) => void;
  onReject?: (item: ApprovalQueueItem) => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? '';
  return `${first}${second}`.toUpperCase();
}

function ApprovalQueueCardItems({ items, onApprove, onReject }: ApprovalQueueCardItemsProps) {
  return (
    <div className="space-y-3 p-3 sm:p-2">
      {items.map((item) => (
        <div
          key={item.id ?? `${item.username}-${item.requestDate}`}
          className="flex flex-col gap-3 rounded-xl bg-[var(--app-surface-2)]/70 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)] text-xs font-bold text-[var(--app-white)]">
              {getInitials(item.username)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-[var(--app-text)]">{item.username}</p>
              <p className="truncate text-sm text-[var(--app-text)]">
                {item.requestType} · {item.numberOfDays}d · {item.requestDate}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              size="sm"
              onClick={() => onApprove?.(item)}
              className="rounded-md bg-[var(--app-success)] text-[var(--app-white)] hover:bg-[var(--app-primary)]"
            >
              Approve
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onReject?.(item)}
              className="rounded-md border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ApprovalQueueCard({ items, onApprove, onReject }: ApprovalQueueCardProps) {
  const approvalQueueStats = items ?? [
    {
      username: 'James Tan',
      requestType: 'Annual Leave',
      requestDate: '2025-07-10',
      numberOfDays: 3,
    },
    {
      username: 'Wei Liang',
      requestType: 'Casual Leave',
      requestDate: '2025-07-15',
      numberOfDays: 1,
    },
    {
      username: 'Sarah Chen',
      requestType: 'Annual Leave',
      requestDate: '2025-08-05',
      numberOfDays: 3,
    },
  ];

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
      <div className="flex items-center justify-between border-[var(--app-border)] px-4 py-4">
        <h3 className="text-xl font-semibold text-[var(--app-text)]">Approval Queue</h3>
        <span className="rounded-full bg-[color:color-mix(in_srgb,var(--app-warning)_20%,var(--app-bg))] px-3 py-1 text-sm font-semibold text-[var(--app-warning)]">
          {approvalQueueStats.length} pending
        </span>
      </div>

      {approvalQueueStats.length > 0 ? (
        <ApprovalQueueCardItems
          items={approvalQueueStats}
          onApprove={onApprove}
          onReject={onReject}
        />
      ) : (
        <p className="p-4 text-sm text-[var(--app-text-muted)]">No pending approvals at the moment.</p>
      )}
    </div>
  );
}
