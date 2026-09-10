import type { ReactNode } from 'react';
import {
  LeaveStatusBadge,
  type LeaveStatus as ManagerLeaveStatus,
} from '@/app/components/leaves/leave-status-badge';

export type { ManagerLeaveStatus };

export function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] ?? '';
  const last = lastName?.[0] ?? '';
  return `${first}${last}`.toUpperCase() || 'NA';
}

type ManagerStatusBadgeProps = {
  status: ManagerLeaveStatus;
};

export function ManagerStatusBadge({ status }: ManagerStatusBadgeProps) {
  return <LeaveStatusBadge status={status} className="px-2 py-0.5" />;
}

type ManagerHeaderProps = {
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export function ManagerPageHeader({ title, subtitle }: ManagerHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold text-[var(--app-text)]">{title}</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">{subtitle}</p>
      </div>
    </div>
  );
}
