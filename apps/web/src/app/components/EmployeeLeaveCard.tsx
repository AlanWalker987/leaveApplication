import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type EmployeeLeaveCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  value: number;
  iconClassName?: string;
};

export default function EmployeeLeaveCard({
  icon,
  title,
  subtitle,
  value,
  iconClassName = 'bg-slate-100 text-slate-700',
}: EmployeeLeaveCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-none">
      <CardContent className="p-4">
        <div
          className={[
            'inline-flex h-10 w-10 items-center justify-center rounded-xl',
            iconClassName,
          ].join(' ')}
        >
          {icon}
        </div>

        <p className="mt-3 text-4xl font-semibold leading-none text-slate-900">{value}</p>
        <p className="mt-2 text-lg font-medium leading-tight text-slate-900">{title}</p>
        <p className="mt-1 text-base leading-tight text-slate-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
