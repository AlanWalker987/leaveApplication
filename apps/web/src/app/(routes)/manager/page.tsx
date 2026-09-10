'use client';

import { useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { BookCheck, CalendarCheck, Clock, Users } from 'lucide-react';
import ManagerOverviewCard from '@/app/components/ManagerOverviewCard';
import ApprovalQueueCard from '@/app/components/ApprovalQueueCard';
import { useManagerLeaveData } from '@/app/hooks/useManagerLeaveData';
import { REVIEW_LEAVE_BY_ID } from '@/app/graphql/manager/managerOperations';
import { ManagerPageHeader } from '@/app/components/manager/manager-leave-shared';
import { getNow, toIsoDateInput } from '@/lib/datetimeutile';

type ReviewLeaveMutationData = {
  reviewLeaveById: {
    id: string;
    status: 'Approved' | 'Rejected';
  };
};

export default function ManagerPage() {
  const { leaves, usersById, loading, error, refetchAll } = useManagerLeaveData();

  const [reviewLeaveById] = useMutation<ReviewLeaveMutationData>(REVIEW_LEAVE_BY_ID);

  const pendingLeaves = useMemo(
    () => leaves.filter((leave) => leave.status === 'Pending'),
    [leaves],
  );

  const approvedLeaves = useMemo(
    () => leaves.filter((leave) => leave.status === 'Approved'),
    [leaves],
  );

  const uniqueTeamMembers = useMemo(
    () => new Set(leaves.map((leave) => leave.userId)).size,
    [leaves],
  );

  const onLeaveTodayCount = useMemo(() => {
    const today = toIsoDateInput(getNow().toISOString());
    return leaves.filter((leave) => {
      if (leave.status !== 'Approved') {
        return false;
      }

      const from = toIsoDateInput(leave.fromDate);
      const to = toIsoDateInput(leave.toDate);
      return today >= from && today <= to;
    }).length;
  }, [leaves]);

  async function onReviewLeave(id: string, status: 'Approved' | 'Rejected') {
    await reviewLeaveById({
      variables: {
        id,
        status,
      },
    });

    await refetchAll();
  }

  const queueItems = pendingLeaves.slice(0, 5).map((leave) => {
    const user = usersById.get(leave.userId);
    const username = user ? `${user.firstName} ${user.lastName}` : 'Unknown Employee';

    return {
      id: leave.id,
      username,
      requestType: leave.leaveTypeDescription,
      requestDate: toIsoDateInput(leave.fromDate),
      numberOfDays: Number(leave.totalDays),
    };
  });

  const managerStats = [
    {
      icon: <Users className="h-5 w-5" />,
      value: uniqueTeamMembers,
      title: 'Team Members',
      iconClassName: 'bg-[var(--app-electric-blue-1)] text-[var(--app-primary)]',
    },
    {
      icon: <Clock className="h-5 w-5" />,
      value: pendingLeaves.length,
      title: 'Pending Approvals',
      iconClassName: 'bg-[color:color-mix(in_srgb,var(--app-warning)_20%,var(--app-bg))] text-[var(--app-warning)]',
    },
    {
      icon: <BookCheck className="h-5 w-5" />,
      value: approvedLeaves.length,
      title: 'Approved Requests',
      iconClassName: 'bg-[color:color-mix(in_srgb,var(--app-success)_16%,var(--app-bg))] text-[var(--app-success)]',
    },
    {
      icon: <CalendarCheck className="h-5 w-5" />,
      value: onLeaveTodayCount,
      title: 'On Leave Today',
      iconClassName: 'bg-[color:color-mix(in_srgb,var(--app-primary)_18%,var(--app-bg))] text-[var(--app-primary)]',
    },
  ];

  return (
    <div className="space-y-4">
      <ManagerPageHeader title="Team Dashboard" subtitle="Your team's leave overview" />

      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {managerStats.map((stat) => (
          <ManagerOverviewCard
            key={stat.title}
            icon={stat.icon}
            value={stat.value}
            title={stat.title}
            iconClassName={stat.iconClassName}
          />
        ))}
      </div>

      {loading ? <p className="text-sm text-[var(--app-text-muted)]">Loading dashboard...</p> : null}
      {error ? (
        <p className="text-sm text-[var(--app-error)]">Error loading dashboard: {error.message}</p>
      ) : null}

      {!loading && !error ? (
        <ApprovalQueueCard
          items={queueItems.map((item) => ({
            id: item.id,
            username: item.username,
            requestType: item.requestType,
            requestDate: item.requestDate,
            numberOfDays: item.numberOfDays,
          }))}
          onApprove={(item) => {
            const queueItem = queueItems.find((row) => row.id === item.id);
            if (queueItem) {
              void onReviewLeave(queueItem.id, 'Approved');
            }
          }}
          onReject={(item) => {
            const queueItem = queueItems.find((row) => row.id === item.id);
            if (queueItem) {
              void onReviewLeave(queueItem.id, 'Rejected');
            }
          }}
        />
      ) : null}
    </div>
  );
}
