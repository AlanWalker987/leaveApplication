'use client';

import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import { getCurrentYear } from '@/lib/datetimeutile';

export type LeaveBalancecardByTypeProps = {
  leave: {
    type: string;
    available: number;
    total: number;
    progressColor: string;
  };
};

type LeaveBalanceSummaryCardProps = {
  earnedLeave: {
    available: number;
    total: number;
  };
  additionalLeave?: {
    available: number;
    total: number;
  } | null;
  loading?: boolean;
};

export default function LeaveBalanceSummaryCard({
  earnedLeave,
  additionalLeave,
  loading = false,
}: LeaveBalanceSummaryCardProps) {
  const currentYear = getCurrentYear();

  const leaveBalances = [
    {
      type: 'Earned Leave',
      available: earnedLeave.available,
      total: earnedLeave.total,
      progressColor: 'bg-[var(--app-success)]',
    },
    ...(additionalLeave
      ? [
          {
            type: 'Additional Leave',
            available: additionalLeave.available,
            total: additionalLeave.total,
            progressColor: 'bg-[var(--app-warning)]',
          },
        ]
      : []),
  ];

  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-[var(--app-text)]">Leave Balance</p>
        <p className="text-sm font-medium text-[var(--app-text-muted)]">{currentYear}</p>
      </div>

      {loading ? <p className="mt-2 text-sm text-[var(--app-text-muted)]">Calculating balances...</p> : null}

      <div className="mt-3 space-y-3">
        {leaveBalances.map((leave) => (
          <LeaveBalanaceCardByType key={leave.type} leave={leave} />
        ))}
      </div>
    </div>
  );
}

function LeaveBalanaceCardByType({ leave }: LeaveBalancecardByTypeProps) {
  return (
    <div key={leave.type} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-2)] p-3.5">
      {/* <p className="text-sm font-medium text-[var(--app-text)]">{leave.type}</p>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">{leave.available} days available</p> */}
      <Progress
        value={leave.available}
        max={leave.total}
        indicatorClassName={leave.progressColor}
        className="w-full"
      >
        <ProgressLabel>{leave.type}</ProgressLabel>
        <ProgressValue>
          {leave.available}/{leave.total} left
        </ProgressValue>
      </Progress>
    </div>
  );
}
