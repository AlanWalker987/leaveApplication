'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { GET_ALL_USERS } from '@/app/graphql/admin/users/userOperations';
import {
  type GetAllVendorsQuery,
  type GetAllVendorsQueryVariables,
  type GetAllUsersQuery,
  type GetAllUsersQueryVariables,
  Role,
} from '@/gql/graphql';
import { Card, CardContent } from '@/components/ui/card';
import { GET_ALL_VENDORS } from '../graphql/admin/vendors/vendorOperations';
import { EmptyContainer } from '@/components/emptyContainer/emptyContainer';

export default function HeadCountByVendorCard() {
  const { data: vendorsData, loading: branchesLoading } = useQuery<
    GetAllVendorsQuery,
    GetAllVendorsQueryVariables
  >(GET_ALL_VENDORS, {
    variables: { offset: 0, limit: 1000 },
  });

  const { data: usersData, loading: usersLoading } = useQuery<
    GetAllUsersQuery,
    GetAllUsersQueryVariables
  >(GET_ALL_USERS, {
    variables: { offset: 0, limit: 1000 },
  });

  const loading = branchesLoading || usersLoading;

  const vendorHeadcount = useMemo(() => {
    const activeBranches = (vendorsData?.getVendors.results ?? []).filter(
      (vendor) => !vendor.isDeleted,
    );
    const employeeUsers = (usersData?.getAllUsers.results ?? []).filter(
      (user) => !user.isDeleted && user.userRole === Role.Employee,
    );

    const countByVendorId = new Map<string, number>();

    for (const user of employeeUsers) {
      if (!user.branchId) {
        continue;
      }

      countByVendorId.set(user.branchId, (countByVendorId.get(user.branchId) ?? 0) + 1);
    }

    return activeBranches
      .map((branch) => ({
        name: branch.name,
        headcount: countByVendorId.get(branch.id) ?? 0,
      }))
      .sort((a, b) => b.headcount - a.headcount)
      .slice(0, 8);
  }, [vendorsData, usersData]);

  return (
    <Card className="rounded-2xl border border-[var(--app-border)] shadow-none">
      <CardContent className="p-5">
        <h3 className="text-[30px] font-semibold text-[var(--app-text)]">Headcount by Vendor</h3>
        <div className="mt-4 h-[240px]">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-[var(--app-text-muted)]">
              Loading...
            </div>
          ) : !vendorHeadcount ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-2)] text-sm text-[var(--app-text-muted)]">
              <EmptyContainer emptyText="No vendor headcount data available." />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorHeadcount} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
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
