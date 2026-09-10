'use client';

import { useQuery } from '@apollo/client';
import Link from 'next/link';
import EmployeeBanner from '../../components/UserBanner';
import EmployeeLeaveCard from '../../components/EmployeeLeaveCard';
import PublicHolidayCard from '../../components/PublicHolidayCard';
import { GET_MY_LEAVES, GET_PUBLIC_HOLIDAYS } from '../../graphql/employee/employeeOperations';
import { CalendarDays, Clock3, CheckCircle2, WalletCards } from 'lucide-react';
import type {
  GetPublicHolidaysQuery,
  GetPublicHolidaysQueryVariables,
  PublicHoliday,
} from '../../../gql/graphql';
import { Calendar } from '@/components/ui/calendar';
import React, { useMemo } from 'react';
import { CalendarIndicators, HolidayTypes } from '@/components/indicators/calendarIndicators';
import LeaveBalanceSummaryCard from '@/app/components/LeaveBalanceSummaryCard';
import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { LeaveStatusBadge, SectionHeaderWithAction } from '@/app/components/employee/leave-shared';
import { compareIsoDateDesc, getNow, parseIsoDate, toIsoDateInput } from '@/lib/datetimeutile';

type GetMyLeavesQueryData = {
  getMyLeaves: {
    results: Array<{
      id: string;
      leaveTypeCode: 'EL' | 'AH' | string;
      leaveTypeDescription: string;
      fromDate: string;
      toDate: string;
      status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
      createdAt: string;
    }>;
  };
};

type LeaveSummary = {
  totalAllowed: number;
  used: number;
  left: number;
};

export default function EmployeePage() {
  const {
    data,
    loading: publicHolidaysLoading,
    error: publicHolidaysError,
  } = useQuery<GetPublicHolidaysQuery, GetPublicHolidaysQueryVariables>(GET_PUBLIC_HOLIDAYS);

  const {
    data: myLeavesData,
    loading: myLeavesLoading,
    error: myLeavesError,
  } = useQuery<GetMyLeavesQueryData>(GET_MY_LEAVES, {
    variables: { offset: 0, limit: 200 },
    fetchPolicy: 'cache-and-network',
  });

  const publicHolidays: PublicHoliday[] = data?.getPublicHolidays.results ?? [];
  const [date, setDate] = React.useState<Date | undefined>(getNow());
  const publicHolidayColor =
    HolidayTypes.find((holiday) => holiday.type === 'Public Holiday')?.color ??
    'var(--app-vibrant-orange-1)';

  const SelectedpublicHolidays = publicHolidays
    .map((holiday) => parseIsoDate(holiday.holidayDate))
    .filter((holidayDate): holidayDate is Date => Boolean(holidayDate));

  const { user } = useCurrentUser();
  const isFemale = user?.gender === 'Female';

  const leaveRows = useMemo(() => myLeavesData?.getMyLeaves.results ?? [], [myLeavesData]);
  const activeLeaves = leaveRows.filter(
    (leave) => leave.status === 'Pending' || leave.status === 'Approved',
  );

  const approvedLeavesCount = leaveRows.filter((leave) => leave.status === 'Approved').length;
  const pendingLeavesCount = leaveRows.filter((leave) => leave.status === 'Pending').length;

  const usedEarnedLeaves = activeLeaves.filter((leave) => leave.leaveTypeCode === 'EL').length;
  const usedAdditionalLeaves = activeLeaves.filter((leave) => leave.leaveTypeCode === 'AH').length;

  const leaveBalance = useMemo(() => {
    const earned: LeaveSummary = {
      totalAllowed: 20,
      used: usedEarnedLeaves,
      left: Math.max(0, 20 - usedEarnedLeaves),
    };

    const additional: LeaveSummary | null = isFemale
      ? {
          totalAllowed: 12,
          used: usedAdditionalLeaves,
          left: Math.max(0, 12 - usedAdditionalLeaves),
        }
      : null;

    return { earned, additional };
  }, [isFemale, usedAdditionalLeaves, usedEarnedLeaves]);

  const daysUsed = activeLeaves.length;

  const recentRequests = useMemo(() => {
    return [...leaveRows].sort((a, b) => compareIsoDateDesc(a.createdAt, b.createdAt)).slice(0, 3);
  }, [leaveRows]);

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-40 isolate pb-4">
        <div aria-hidden className="absolute inset-0 bg-[var(--app-surface)]" />
        <div className="relative">
          <EmployeeBanner />
        </div>
      </div>
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <EmployeeLeaveCard
          icon={<CalendarDays className="h-5 w-5" />}
          value={leaveBalance.earned.left}
          title="Days Available"
          subtitle="Earned leave"
          iconClassName="bg-[var(--app-electric-blue-1)] text-[var(--app-primary)]"
        />
        <EmployeeLeaveCard
          icon={<Clock3 className="h-5 w-5" />}
          value={pendingLeavesCount}
          title="Pending Approval"
          subtitle="requests in queue"
          iconClassName="bg-[color:color-mix(in_srgb,var(--app-warning)_20%,var(--app-bg))] text-[var(--app-warning)]"
        />
        <EmployeeLeaveCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          value={approvedLeavesCount}
          title="Approved Leaves"
          subtitle="this year"
          iconClassName="bg-[color:color-mix(in_srgb,var(--app-success)_16%,var(--app-bg))] text-[var(--app-success)]"
        />
        <EmployeeLeaveCard
          icon={<WalletCards className="h-5 w-5" />}
          value={daysUsed}
          title="Days Used"
          subtitle="across all types"
          iconClassName="bg-[color:color-mix(in_srgb,var(--app-primary)_18%,var(--app-bg))] text-[var(--app-primary)]"
        />
      </div>

      <div className="w-full min-w-0 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <section className="xl:col-span-6">
            <div className="mx-auto w-full max-w-[620px] rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 xl:mx-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full rounded-xl"
                classNames={{
                  months: 'relative flex flex-col justify-center gap-4 md:flex-row',
                }}
                modifiers={{
                  holiday: SelectedpublicHolidays,
                }}
                modifiersStyles={{
                  today: {
                    color: 'var(--app-primary)',
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
            </div>

            <div className="mx-auto mt-3 w-full max-w-[620px] rounded-xl px-3 py-2 xl:mx-0">
              <CalendarIndicators />
            </div>

            <div className="mx-auto mt-4 w-full max-w-[620px] xl:mx-0">
              <LeaveInsightsCard
                pendingLeavesCount={pendingLeavesCount}
                approvedLeavesCount={approvedLeavesCount}
                daysUsed={daysUsed}
              />
            </div>
          </section>

          <section className="space-y-4 xl:col-span-6">
            <LeaveBalanceSummaryCard
              earnedLeave={{
                available: leaveBalance.earned.left,
                total: leaveBalance.earned.totalAllowed,
              }}
              additionalLeave={
                leaveBalance.additional
                  ? {
                      available: leaveBalance.additional.left,
                      total: leaveBalance.additional.totalAllowed,
                    }
                  : null
              }
              loading={myLeavesLoading}
            />
            <MyRecentRequestsCard requests={recentRequests} loading={myLeavesLoading} />
            <TeamOnLeaveCard />
          </section>
        </div>
      </div>

      {publicHolidaysLoading && <p>Loading public holidays...</p>}
      {publicHolidaysError && <p>Error loading public holidays: {publicHolidaysError.message}</p>}
      {myLeavesError && <p>Error loading leave data: {myLeavesError.message}</p>}
      {!publicHolidaysLoading && !publicHolidaysError && (
        <PublicHolidayCard holidays={publicHolidays} />
      )}

      {/* <div className="mt-5 rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-center text-sm text-[var(--app-text-muted)]">
        Dashboard page scaffold. Add real employee dashboard UI here.
      </div> */}
    </div>
  );
}

function LeaveInsightsCard({
  pendingLeavesCount,
  approvedLeavesCount,
  daysUsed,
}: {
  pendingLeavesCount: number;
  approvedLeavesCount: number;
  daysUsed: number;
}) {
  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-[var(--app-text)]">Leave Snapshot</p>
        <Link
          href="/employee/apply-leave"
          className="text-sm font-semibold text-[var(--app-primary)] hover:underline"
        >
          Apply leave
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-[color:color-mix(in_srgb,var(--app-warning)_20%,var(--app-bg))] px-3 py-2">
          <p className="text-xs font-medium text-[var(--app-warning)]">Pending</p>
          <p className="mt-1 text-xl font-semibold text-[var(--app-warning)]">{pendingLeavesCount}</p>
        </div>
        <div className="rounded-lg bg-[color:color-mix(in_srgb,var(--app-success)_16%,var(--app-bg))] px-3 py-2">
          <p className="text-xs font-medium text-[var(--app-success)]">Approved</p>
          <p className="mt-1 text-xl font-semibold text-[var(--app-success)]">{approvedLeavesCount}</p>
        </div>
        <div className="rounded-lg bg-[color:color-mix(in_srgb,var(--app-primary)_18%,var(--app-bg))] px-3 py-2">
          <p className="text-xs font-medium text-[var(--app-primary)]">Used</p>
          <p className="mt-1 text-xl font-semibold text-[var(--app-primary)]">{daysUsed}</p>
        </div>
      </div>
    </div>
  );
}

function MyRecentRequestsCard({
  requests,
  loading,
}: {
  requests: Array<{
    id: string;
    leaveTypeDescription: string;
    fromDate: string;
    toDate: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  }>;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <SectionHeaderWithAction
        title="My Recent Requests"
        actionLabel="View all"
        actionHref="/employee/leave-status"
      />

      <div className="mt-4 space-y-3">
        {loading ? <p className="text-sm text-[var(--app-text-muted)]">Loading requests...</p> : null}

        {!loading && requests.length === 0 ? (
          <p className="text-sm text-[var(--app-text-muted)]">No leave requests yet.</p>
        ) : null}

        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-start justify-between gap-3 rounded-lg bg-[var(--app-surface-2)] px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[var(--app-text)]">
                {request.leaveTypeDescription}
              </p>
              <p className="mt-0.5 text-sm text-[var(--app-text-muted)]">
                {toIsoDateInput(request.fromDate)} {' - '} {toIsoDateInput(request.toDate)}
              </p>
            </div>
            <LeaveStatusBadge status={request.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamOnLeaveCard() {
  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-lg font-semibold text-[var(--app-text)]">Team On Leave</p>
      </div>
      <div className="mt-4 rounded-lg bg-[var(--app-surface-2)] px-3 py-3 text-sm text-[var(--app-text-muted)]">
        No team leave updates available.
      </div>
    </div>
  );
}
