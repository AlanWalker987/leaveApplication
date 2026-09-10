'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { GET_ALL_DEPARTMENT_DETAILS } from '@/app/graphql/admin/departments/departmentOperations';
import { type GetDepartmentsQuery, type GetDepartmentsQueryVariables } from '@/gql/graphql';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/loader/Loader';
import { EmptyContainer } from '@/components/emptyContainer/emptyContainer';

const DEPARTMENT_COLORS = [
  'var(--app-primary)',
  'var(--app-success)',
  'var(--app-warning)',
  'var(--app-electric-blue-2)',
  'var(--app-gold-2)',
  'var(--app-error)',
];

export default function HeadcountByDepartmentCard() {
  const { data: departmentsData, loading } = useQuery<
    GetDepartmentsQuery,
    GetDepartmentsQueryVariables
  >(GET_ALL_DEPARTMENT_DETAILS, {
    variables: { offset: 0, limit: 1000 },
  });

  const departmentHeadcount = useMemo(() => {
    return (departmentsData?.getDepartments.results ?? [])
      .filter((department) => !department.isDeleted)
      .map((department) => ({
        name: department.name,
        headcount: department.employees.length,
      }))
      .sort((a, b) => b.headcount - a.headcount)
      .slice(0, 8);
  }, [departmentsData]);

  const hasDepartmentHeadcount = departmentHeadcount.length > 0;

  return (
    <Card className="rounded-2xl border border-[var(--app-border)] shadow-none">
      <CardContent className="p-5">
        <h3 className="text-[30px] font-semibold text-[var(--app-text)]">
          Headcount by Department
        </h3>
        <div className="mt-4 h-[240px]">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-[var(--app-text-muted)]">
              <Loader />
            </div>
          ) : !hasDepartmentHeadcount ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-2)] text-sm text-[var(--app-text-muted)]">
              <EmptyContainer emptyText="No department headcount data available." />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(value, _name, item) => {
                    console.log({ item });
                    const payload = item?.payload as { name?: string } | undefined;
                    const departmentName = payload?.name ?? 'Department';
                    console.log({ departmentName });
                    return [`${departmentName} : ${String(value ?? 0)}`, ''];
                  }}
                />
                <Pie
                  data={departmentHeadcount}
                  dataKey="headcount"
                  nameKey="name"
                  innerRadius="75%"
                  outerRadius="95%"
                  cornerRadius={6}
                  paddingAngle={2}
                  isAnimationActive
                >
                  {departmentHeadcount.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
