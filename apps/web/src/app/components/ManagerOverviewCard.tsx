import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type ManagerOverviewCardProps = {
  icon: ReactNode;
  title: string;
  value: number;
  iconClassName?: string;
};

export default function ManagerOverview({
  icon,
  title,
  value,
  iconClassName = 'bg-[var(--app-surface-2)] text-[var(--app-text)]',
}: ManagerOverviewCardProps) {
  return (
    <Card className="h-full rounded-2xl border border-[var(--app-border)] shadow-none">
      <CardContent className="h-full p-4">
        <div
          className={[
            'inline-flex h-10 w-10 items-center justify-center rounded-xl',
            iconClassName,
          ].join(' ')}
        >
          {icon}
        </div>

        <p className="mt-3 text-4xl font-semibold leading-none text-[var(--app-text)]">{value}</p>
        <p className="mt-2 text-lg font-medium leading-tight text-[var(--app-text)]">{title}</p>
      </CardContent>
    </Card>
  );
}
