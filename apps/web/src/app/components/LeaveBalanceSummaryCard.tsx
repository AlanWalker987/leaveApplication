'use client';

import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';

export type LeaveBalancecardByTypeProps = {
  leave: {
    type: string;
    available: number;
    total: number;
    progressColor: string;
  };
};

export default function LeaveBalanceSummaryCard() {
  const currentYear = new Date().getFullYear();

  const leaveBalances = [
    { type: 'Annual Leave', available: 11, total: 20, progressColor: 'bg-blue-600' },
    { type: 'Earn Leave', available: 5, total: 10, progressColor: 'bg-emerald-600' },
    { type: 'Additional Leave', available: 2, total: 5, progressColor: 'bg-amber-500' },
  ];

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-900">Leave Balance</p>
        <p className="text-sm text-slate-900">{currentYear}</p>
      </div>

      {leaveBalances.map((leave) => (
        <LeaveBalanaceCardByType key={leave.type} leave={leave} />
      ))}
    </div>
  );
}

function LeaveBalanaceCardByType({ leave }: LeaveBalancecardByTypeProps) {
  return (
    <div key={leave.type} className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
      {/* <p className="text-sm font-medium text-slate-800">{leave.type}</p>
      <p className="mt-1 text-sm text-slate-500">{leave.available} days available</p> */}
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
