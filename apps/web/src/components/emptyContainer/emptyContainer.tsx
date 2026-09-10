import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Inbox } from 'lucide-react';

export function EmptyContainer({ emptyText }: { emptyText?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox className="h-12 w-12 text-[var(--app-text-muted)]" />
          </EmptyMedia>
          <EmptyTitle>{emptyText}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
