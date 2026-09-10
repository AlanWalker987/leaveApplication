'use client';

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@apollo/client';
import { Layers3, MapPin, ShieldCheck, Users } from 'lucide-react';
import { GET_ALL_USERS } from '@/app/graphql/admin/users/userOperations';
import { GET_ALL_DEPARTMENT_DETAILS } from '@/app/graphql/admin/departments/departmentOperations';
import { GET_ALL_BRANCHES } from '@/app/graphql/admin/branches/branchOperations';
import HeadcountByDepartmentCard from '@/app/components/HeadcountByDepartmentCard';
import HeadcountByBranchCard from '@/app/components/HeadcountByBranchCard';
import HeadCountByVendorCard from '@/app/components/HeadCountByVendorCard';
import { StartTourButton } from '@/app/components/StartTourButton';
import { TourTarget } from 'company-user-tour';

export default function AdminPage() {
  const paginationVariables = useMemo(() => ({ offset: 0, limit: 1000 }), []);

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(GET_ALL_USERS, {
    variables: paginationVariables,
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: departmentsData,
    loading: departmentsLoading,
    error: departmentsError,
  } = useQuery(GET_ALL_DEPARTMENT_DETAILS, {
    variables: paginationVariables,
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: branchesData,
    loading: branchesLoading,
    error: branchesError,
  } = useQuery(GET_ALL_BRANCHES, {
    variables: paginationVariables,
    fetchPolicy: 'cache-and-network',
  });

  const users = useMemo(() => usersData?.getAllUsers?.results ?? [], [usersData]);
  const departments = useMemo(
    () => departmentsData?.getDepartments?.results ?? [],
    [departmentsData],
  );
  const branches = useMemo(() => branchesData?.getBranches?.results ?? [], [branchesData]);

  const totals = useMemo(() => {
    const activeUsers = users.filter((user: { isDeleted?: boolean | null }) => !user.isDeleted);
    const totalEmployees = activeUsers.filter(
      (user: { userRole?: string | null }) => user.userRole === 'Employee',
    ).length;
    const totalManagers = activeUsers.filter(
      (user: { userRole?: string | null }) => user.userRole === 'Manager',
    ).length;
    const totalDepartments = departments.filter(
      (department: { isDeleted?: boolean | null }) => !department.isDeleted,
    ).length;
    const totalBranches = branches.filter(
      (branch: { isDeleted?: boolean | null }) => !branch.isDeleted,
    ).length;

    return {
      totalEmployees,
      totalManagers,
      totalDepartments,
      totalBranches,
    };
  }, [branches, departments, users]);

  const loading = usersLoading || departmentsLoading || branchesLoading;
  const error = usersError || departmentsError || branchesError;

  return (
    <div className="space-y-5">
      <StartTourButton tourId="admin-dashboard" />
      <TourTarget id="admin-dashboard-overview">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--app-text)]">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Organisation structure and workforce overview
          </p>
        </div>
      </TourTarget>

      {error ? (
        <p className="rounded-xl border border-[color:color-mix(in_srgb,var(--app-error)_30%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] px-3 py-2 text-sm text-[var(--app-error)]">
          Error loading dashboard data: {error.message}
        </p>
      ) : null}

      <TourTarget id="admin-dashboard-stats">
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            icon={<Users className="h-4 w-4" />}
            iconClassName="bg-[var(--app-electric-blue-1)] text-[var(--app-primary)]"
            value={totals.totalEmployees}
            label="Total Employees"
            loading={loading}
          />
          <DashboardStatCard
            icon={<ShieldCheck className="h-4 w-4" />}
            iconClassName="bg-[color:color-mix(in_srgb,var(--app-primary)_18%,var(--app-bg))] text-[var(--app-primary)]"
            value={totals.totalManagers}
            label="Managers"
            loading={loading}
          />
          <DashboardStatCard
            icon={<Layers3 className="h-4 w-4" />}
            iconClassName="bg-[color:color-mix(in_srgb,var(--app-success)_16%,var(--app-bg))] text-[var(--app-success)]"
            value={totals.totalDepartments}
            label="Departments"
            loading={loading}
          />
          <DashboardStatCard
            icon={<MapPin className="h-4 w-4" />}
            iconClassName="bg-[color:color-mix(in_srgb,var(--app-warning)_20%,var(--app-bg))] text-[var(--app-warning)]"
            value={totals.totalBranches}
            label="Branches"
            loading={loading}
          />
        </div>
      </TourTarget>

      <TourTarget id="admin-dashboard-breakdown">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <HeadcountByDepartmentCard />
          <HeadcountByBranchCard />
          <HeadCountByVendorCard />
        </div>
      </TourTarget>
    </div>
  );
}

type DashboardStatCardProps = {
  icon: ReactNode;
  iconClassName: string;
  value: number;
  label: string;
  loading: boolean;
};

function DashboardStatCard({ icon, iconClassName, value, label, loading }: DashboardStatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <span
        className={[
          'inline-flex h-8 w-8 items-center justify-center rounded-lg',
          iconClassName,
        ].join(' ')}
      >
        {icon}
      </span>
      <p className="mt-3 text-3xl font-semibold leading-none text-[var(--app-text)]">
        {loading ? '-' : value}
      </p>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">{label}</p>
    </div>
  );
}
