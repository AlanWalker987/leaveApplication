// import type { PublicHoliday } from '../../gql/graphql';

// export default function PublicHolidayCard({ holidays }: { holidays: PublicHoliday[] }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <p className="text-sm text-slate-500">Public Holidays</p>

//       <div className="mt-4 overflow-x-auto overflow-y-hidden">
//         <div className="flex gap-3">
//           {holidays.map((holiday) => (
//             <PublicHolidayCardDetails key={holiday.id} holiday={holiday} />
//           ))}

//           {holidays.length === 0 && (
//             <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
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
//     <div className="min-w-[240px] shrink-0 rounded-xl border border-slate-100 bg-slate-50 p-4">
//       <p className="text-sm font-medium text-slate-800">{holiday.title}</p>
//       <p className="mt-1 text-sm text-slate-500">
//         {new Date(holiday.holidayDate).toLocaleDateString()}
//       </p>
//     </div>
//   );
// }

'use client';

import { useRef } from 'react';
import type { PublicHoliday } from '../../gql/graphql';

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
    <div className="mt-4 w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">Public Holidays</p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollHolidays(-1)}
            aria-label="Scroll public holidays left"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span aria-hidden="true">&#8249;</span>
          </button>

          <button
            type="button"
            onClick={() => scrollHolidays(1)}
            aria-label="Scroll public holidays right"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50"
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
            <div className="w-60 flex-none rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
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
    <div className="min-w-[220px] flex-none rounded-xl border border-slate-200 bg-slate-50 p-4 transition-shadow hover:shadow-sm sm:min-w-[240px]">
      <p className="text-sm font-semibold text-slate-900">{holiday.title}</p>

      <p className="mt-2 text-sm text-slate-500">
        {new Date(holiday.holidayDate).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}
