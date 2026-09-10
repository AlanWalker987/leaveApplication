import Link from 'next/link';
import {
  LeaveStatusBadge,
  type LeaveStatus as LeaveRequestStatus,
} from '@/app/components/leaves/leave-status-badge';

export type { LeaveRequestStatus };
export { LeaveStatusBadge };

export function LeaveHistoryStatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3">
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-semibold ${valueClassName ?? 'text-[var(--app-text)]'}`}>
          {value}
        </span>
        <span className="text-sm text-[var(--app-text-muted)]">{label}</span>
      </div>
    </div>
  );
}

export function SectionHeaderWithAction({
  title,
  actionLabel,
  actionHref,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-[var(--app-text)]">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-[var(--app-text-muted)]">{subtitle}</p> : null}
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="shrink-0 text-sm font-semibold text-[var(--app-primary)] hover:underline"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
