'use client';

import { cn } from '@/lib/utils';

export type LeaveStatus = 'Approved' | 'Pending' | 'Rejected' | 'Cancelled';

const STATUS_STYLES: Record<LeaveStatus, string> = {
  Approved: 'bg-[color:color-mix(in_srgb,var(--app-success)_16%,var(--app-bg))] text-[var(--app-success)]',
  Pending: 'bg-[color:color-mix(in_srgb,var(--app-warning)_20%,var(--app-bg))] text-[var(--app-warning)]',
  Rejected: 'bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] text-[var(--app-error)]',
  Cancelled: 'bg-[var(--app-surface-2)] text-[var(--app-text)]',
};

type LeaveStatusBadgeProps = {
  status: LeaveStatus;
  className?: string;
};

export function LeaveStatusBadge({ status, className }: LeaveStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        STATUS_STYLES[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
