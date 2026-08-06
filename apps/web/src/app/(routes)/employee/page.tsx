'use client';

import { useQuery } from '@apollo/client';
import EmployeeBanner from '../../components/EmployeeBanner';
import EmployeeLeaveCard from '../../components/EmployeeLeaveCard';
import PublicHolidayCard from '../../components/PublicHolidayCard';
import { GET_PUBLIC_HOLIDAYS } from '../../graphql/employee/employeeOperations';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock3, CheckCircle2, WalletCards } from 'lucide-react';
import type {
  GetPublicHolidaysQuery,
  GetPublicHolidaysQueryVariables,
  PublicHoliday,
} from '../../../gql/graphql';
import { Calendar } from '@/components/ui/calendar';
import React from 'react';

export default function EmployeePage() {
  const {
    data,
    loading: publicHolidaysLoading,
    error: publicHolidaysError,
  } = useQuery<GetPublicHolidaysQuery, GetPublicHolidaysQueryVariables>(GET_PUBLIC_HOLIDAYS);

  const publicHolidays: PublicHoliday[] = data?.getPublicHolidays.results ?? [];
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const SelectedpublicHolidays = publicHolidays.map((holiday) => new Date(holiday.holidayDate));
  return (
    <>
      <div className="sticky top-0 z-50 isolate -mx-4 -mt-4 bg-[#f4f6fb] px-4 pb-4 pt-4 md:-mx-5 md:-mt-5 md:px-5 md:pt-5">
        <EmployeeBanner />
      </div>
      <div className="flex items-center justify-end">
        <Button variant="default" size="sm" type="button">
          Apply Leave
        </Button>
      </div>
      <div className="mt-3 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <EmployeeLeaveCard
          icon={<CalendarDays className="h-5 w-5" />}
          value={11}
          title="Days Available"
          subtitle="Annual leave"
          iconClassName="bg-blue-50 text-blue-600"
        />
        <EmployeeLeaveCard
          icon={<Clock3 className="h-5 w-5" />}
          value={4}
          title="Pending Approval"
          subtitle="requests in queue"
          iconClassName="bg-amber-50 text-amber-600"
        />
        <EmployeeLeaveCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          value={2}
          title="Approved Leaves"
          subtitle="this year"
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <EmployeeLeaveCard
          icon={<WalletCards className="h-5 w-5" />}
          value={7}
          title="Days Used"
          subtitle="across all types"
          iconClassName="bg-violet-50 text-violet-600"
        />
      </div>

      <div className="mt-4 w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="h-[420px] w-full max-w-[360px] rounded-lg border"
          classNames={{
            months: 'relative flex flex-col justify-center gap-4 md:flex-row',
          }}
          modifiers={{
            holiday: SelectedpublicHolidays,
          }}
          modifiersStyles={{
            holiday: {
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '9999px',
              fontWeight: 'bold',
            },
          }}
          captionLayout="dropdown"
        />
      </div>

      {publicHolidaysLoading && <p>Loading public holidays...</p>}
      {publicHolidaysError && <p>Error loading public holidays: {publicHolidaysError.message}</p>}
      {!publicHolidaysLoading && !publicHolidaysError && (
        <PublicHolidayCard holidays={publicHolidays} />
      )}

      {/* <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Dashboard page scaffold. Add real employee dashboard UI here.
      </div> */}
    </>
  );
}
