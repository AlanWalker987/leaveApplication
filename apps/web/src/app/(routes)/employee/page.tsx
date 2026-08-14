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
import { CalendarIndicators, HolidayTypes } from '@/components/indicators/calendarIndicators';
import LeaveBalanceSummaryCard from '@/app/components/LeaveBalanceSummaryCard';

export default function EmployeePage() {
  const {
    data,
    loading: publicHolidaysLoading,
    error: publicHolidaysError,
  } = useQuery<GetPublicHolidaysQuery, GetPublicHolidaysQueryVariables>(GET_PUBLIC_HOLIDAYS);

  const publicHolidays: PublicHoliday[] = data?.getPublicHolidays.results ?? [];
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const publicHolidayColor =
    HolidayTypes.find((holiday) => holiday.type === 'Public Holiday')?.color ?? '#FFB6B6';

  const SelectedpublicHolidays = publicHolidays.map((holiday) => new Date(holiday.holidayDate));
  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-40 isolate bg-[#f8f8f8] pb-4">
        <EmployeeBanner />
      </div>
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:items-stretch">
          {/* Calendar + Indicators */}
          <div className="flex h-full w-full min-w-0 flex-col">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 pb-4"
              classNames={{
                months: 'relative flex flex-col justify-center gap-4 md:flex-row',
              }}
              modifiers={{
                holiday: SelectedpublicHolidays,
              }}
              modifiersStyles={{
                today: {
                  color: '#2563eb',
                  fontWeight: 'bold',
                },
                holiday: {
                  backgroundColor: publicHolidayColor,
                  color: 'white',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                },
              }}
              captionLayout="dropdown"
            />

            <CalendarIndicators />
          </div>

          {/* Immediately next to Calendar */}
          <div className="h-full w-full min-w-0">
            <LeaveBalanceSummaryCard />
          </div>

          <div className="flex h-full w-full min-w-0 flex-col gap-6">
            <DashboardPlaceholderCard title="My Recent Requests" />
            <DashboardPlaceholderCard title="Team On Leave" />
          </div>
        </div>
      </div>

      {publicHolidaysLoading && <p>Loading public holidays...</p>}
      {publicHolidaysError && <p>Error loading public holidays: {publicHolidaysError.message}</p>}
      {!publicHolidaysLoading && !publicHolidaysError && (
        <PublicHolidayCard holidays={publicHolidays} />
      )}

      {/* <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Dashboard page scaffold. Add real employee dashboard UI here.
      </div> */}
    </div>
  );
}

function DashboardPlaceholderCard({ title }: { title: string }) {
  return (
    <div className="h-full min-h-[220px] rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-medium text-slate-900">{title}</p>
    </div>
  );
}
