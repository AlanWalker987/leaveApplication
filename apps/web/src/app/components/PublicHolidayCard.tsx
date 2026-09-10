// import type { PublicHoliday } from '../../gql/graphql';

// export default function PublicHolidayCard({ holidays }: { holidays: PublicHoliday[] }) {
//   return (
//     <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
//       <p className="text-sm text-[var(--app-text-muted)]">Public Holidays</p>

//       <div className="mt-4 overflow-x-auto overflow-y-hidden">
//         <div className="flex gap-3">
//           {holidays.map((holiday) => (
//             <PublicHolidayCardDetails key={holiday.id} holiday={holiday} />
//           ))}

//           {holidays.length === 0 && (
//             <div className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-2)] p-4 text-sm text-[var(--app-text-muted)]">
//               No public holidays found.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function PublicHolidayCardDetails({ holiday }: { holiday: PublicHoliday }) {
//   return (
//     <div className="min-w-[240px] shrink-0 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-2)] p-4">
//       <p className="text-sm font-medium text-[var(--app-text)]">{holiday.title}</p>
//       <p className="mt-1 text-sm text-[var(--app-text-muted)]">
//         {new Date(holiday.holidayDate).toLocaleDateString()}
//       </p>
//     </div>
//   );
// }

'use client';

import { useRef } from 'react';
import type { PublicHoliday } from '../../gql/graphql';
import { formatDateValue } from '@/lib/datetimeutile';

interface PublicHolidayCardProps {
  holidays: PublicHoliday[];
}

export default function PublicHolidayCard({ holidays }: PublicHolidayCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function scrollHolidays(direction: -1 | 1) {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const scrollAmount = Math.max(container.clientWidth * 0.75, 240);
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  }

  return (
    <div className="mt-4 w-full min-w-0 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--app-text-muted)]">Public Holidays</p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollHolidays(-1)}
            aria-label="Scroll public holidays left"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] transition-colors hover:bg-[var(--app-surface-2)]"
          >
            <span aria-hidden="true">&#8249;</span>
          </button>

          <button
            type="button"
            onClick={() => scrollHolidays(1)}
            aria-label="Scroll public holidays right"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] transition-colors hover:bg-[var(--app-surface-2)]"
          >
            <span aria-hidden="true">&#8250;</span>
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="mt-4 w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-w-max flex-nowrap gap-3 px-1 pb-2 sm:px-2">
          {holidays.length > 0 ? (
            holidays.map((holiday) => (
              <PublicHolidayCardDetails key={holiday.id} holiday={holiday} />
            ))
          ) : (
            <div className="w-60 flex-none rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-2)] p-4 text-sm text-[var(--app-text-muted)]">
              No public holidays found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PublicHolidayCardDetails({ holiday }: { holiday: PublicHoliday }) {
  return (
    <div className="min-w-[220px] flex-none rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-2)] p-4 transition-shadow hover:shadow-sm sm:min-w-[240px]">
      <p className="text-sm font-semibold text-[var(--app-text)]">{holiday.title}</p>

      <p className="mt-2 text-sm text-[var(--app-text-muted)]">
        {formatDateValue(holiday.holidayDate, 'd MMM yyyy', '-')}
      </p>
    </div>
  );
}
