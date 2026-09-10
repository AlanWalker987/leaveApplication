'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { GET_ALL_BRANCHES } from '@/app/graphql/admin/branches/branchOperations';
import { GET_ALL_USERS } from '@/app/graphql/admin/users/userOperations';
import {
  type GetAllBranchesAdminQuery,
  type GetAllBranchesAdminQueryVariables,
  type GetAllUsersQuery,
  type GetAllUsersQueryVariables,
  Role,
} from '@/gql/graphql';
import { Card, CardContent } from '@/components/ui/card';

export default function HeadcountByBranchCard() {
  const { data: branchesData, loading: branchesLoading } = useQuery<
    GetAllBranchesAdminQuery,
    GetAllBranchesAdminQueryVariables
  >(GET_ALL_BRANCHES, {
    variables: { offset: 0, limit: 1000 },
  });

  const { data: usersData, loading: usersLoading } = useQuery<
    GetAllUsersQuery,
    GetAllUsersQueryVariables
  >(GET_ALL_USERS, {
    variables: { offset: 0, limit: 1000 },
  });

  const loading = branchesLoading || usersLoading;

  const branchHeadcount = useMemo(() => {
    const activeBranches = (branchesData?.getBranches.results ?? []).filter(
      (branch) => !branch.isDeleted,
    );
    const employeeUsers = (usersData?.getAllUsers.results ?? []).filter(
      (user) => !user.isDeleted && user.userRole === Role.Employee,
    );

    const countByBranchId = new Map<string, number>();

    for (const user of employeeUsers) {
      if (!user.branchId) {
        continue;
      }

      countByBranchId.set(user.branchId, (countByBranchId.get(user.branchId) ?? 0) + 1);
    }

    return activeBranches
      .map((branch) => ({
        name: branch.name,
        headcount: countByBranchId.get(branch.id) ?? 0,
      }))
      .sort((a, b) => b.headcount - a.headcount)
      .slice(0, 8);
  }, [branchesData, usersData]);

  const hasBranchHeadcount = branchHeadcount.length > 0;

  return (
    <Card className="rounded-2xl border border-[var(--app-border)] shadow-none">
      <CardContent className="p-5">
        <h3 className="text-[30px] font-semibold text-[var(--app-text)]">Headcount by Branch</h3>
        <div className="mt-4 h-[240px]">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-[var(--app-text-muted)]">
              Loading...
            </div>
          ) : !hasBranchHeadcount ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-2)] text-sm text-[var(--app-text-muted)]">
              No branch headcount data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchHeadcount} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border)" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--app-text-muted)', fontSize: 12 }}
                />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'var(--app-surface-2)' }}
                  formatter={(value) => [`${String(value ?? 0)}`, 'Employees']}
                />
                <Bar
                  dataKey="headcount"
                  fill="var(--app-primary)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={52}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
