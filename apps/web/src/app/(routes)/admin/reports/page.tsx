'use client';

import { useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GET_ALL_DEPARTMENT_DETAILS } from '@/app/graphql/admin/departments/departmentOperations';
import { GET_ALL_USERS } from '@/app/graphql/admin/users/userOperations';
import { useAdminLeaveData } from '@/app/hooks/useAdminLeaveData';
import { type GetDepartmentsQuery, type GetDepartmentsQueryVariables } from '@/gql/graphql';
import {
  exportLeavesAvailedTimesheetExcel as generateLeavesAvailedTimesheetExcel,
  type TimesheetLeave,
  type TimesheetUser,
} from './exporters/leaves-availed-excel';
import {
  exportLeavesAvailedPdf as generateLeavesAvailedPdf,
  type LeavesAvailedPdfRow,
} from './exporters/leaves-availed-pdf';
import {
  getCurrentYear,
  getMonthIndexFromIso,
  getMonthLabel,
  toIsoDateInput,
  getYearFromIso,
} from '@/lib/datetimeutile';

const ALL_DEPARTMENTS = 'all';

type LeaveTrendPoint = {
  month: string;
  totalLeaves: number;
};

type UsersQueryData = {
  getAllUsers: {
    results: Array<
      TimesheetUser & {
        userRole: string;
        isDeleted: boolean;
      }
    >;
  };
};

function toMonthLabel(monthIndex: number): string {
  return getMonthLabel(monthIndex, getCurrentYear());
}

export default function AdminReportsPage() {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(ALL_DEPARTMENTS);
  const departmentQueryVariables = useMemo(() => ({ offset: 0, limit: 1000 }), []);
  const usersQueryVariables = useMemo(() => ({ offset: 0, limit: 2000 }), []);
  const {
    leaves,
    usersById,
    branchesById,
    vendorsById,
    loading: leavesLoading,
    error: leavesError,
  } = useAdminLeaveData();

  const {
    data: departmentsData,
    loading: departmentsLoading,
    error: departmentsError,
  } = useQuery<GetDepartmentsQuery, GetDepartmentsQueryVariables>(GET_ALL_DEPARTMENT_DETAILS, {
    variables: departmentQueryVariables,
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery<UsersQueryData>(GET_ALL_USERS, {
    variables: usersQueryVariables,
    fetchPolicy: 'cache-and-network',
  });

  const departments = useMemo(
    () =>
      (departmentsData?.getDepartments.results ?? [])
        .filter((department) => !department.isDeleted)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [departmentsData],
  );

  const selectedDepartmentName = useMemo(() => {
    if (selectedDepartmentId === ALL_DEPARTMENTS) {
      return 'All Departments';
    }

    return departments.find((department) => department.id === selectedDepartmentId)?.name ?? '-';
  }, [departments, selectedDepartmentId]);

  const users = useMemo(() => usersData?.getAllUsers.results ?? [], [usersData]);
  const usersForTimesheet = useMemo(
    () => users.filter((user) => !user.isDeleted && user.userRole === 'Employee'),
    [users],
  );

  const selectedDepartmentEmployeeIds = useMemo(() => {
    if (selectedDepartmentId === ALL_DEPARTMENTS) {
      return null;
    }

    const department = departments.find((row) => row.id === selectedDepartmentId);
    return new Set((department?.employees ?? []).map((employee) => employee.id));
  }, [departments, selectedDepartmentId]);

  const filteredUsersForTimesheet = useMemo(() => {
    if (!selectedDepartmentEmployeeIds) {
      return usersForTimesheet;
    }

    return usersForTimesheet.filter((user) => selectedDepartmentEmployeeIds.has(user.id));
  }, [selectedDepartmentEmployeeIds, usersForTimesheet]);

  const approvedLeaves = useMemo(
    () => leaves.filter((leave) => leave.status === 'Approved'),
    [leaves],
  );

  const filteredApprovedLeaves = useMemo(() => {
    if (!selectedDepartmentEmployeeIds) {
      return approvedLeaves;
    }

    return approvedLeaves.filter((leave) => selectedDepartmentEmployeeIds.has(leave.userId));
  }, [approvedLeaves, selectedDepartmentEmployeeIds]);

  const leavesForExcel = useMemo<TimesheetLeave[]>(() => {
    return filteredApprovedLeaves.map((leave) => ({
      userId: leave.userId,
      leaveTypeCode: leave.leaveTypeCode,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      totalDays: Number(leave.totalDays),
    }));
  }, [filteredApprovedLeaves]);

  const leavesAvailedPdfRows = useMemo<LeavesAvailedPdfRow[]>(() => {
    return filteredApprovedLeaves
      .map((leave) => {
        const user = usersById.get(leave.userId);
        const approver = leave.managerId ? usersById.get(leave.managerId) : null;

        return {
          employeeName: user ? `${user.firstName} ${user.lastName}` : 'Unknown Employee',
          vendor: user?.vendorId ? (vendorsById.get(user.vendorId)?.name ?? '-') : '-',
          branch: user?.branchId ? (branchesById.get(user.branchId)?.name ?? '-') : '-',
          leaveType: leave.leaveTypeDescription,
          fromDate: toIsoDateInput(leave.fromDate),
          toDate: toIsoDateInput(leave.toDate),
          days: Number(leave.totalDays),
          approvedBy: approver ? `${approver.firstName} ${approver.lastName}` : 'Manager',
        };
      })
      .sort((a, b) => a.employeeName.localeCompare(b.employeeName));
  }, [branchesById, filteredApprovedLeaves, usersById, vendorsById]);

  const trendData = useMemo<LeaveTrendPoint[]>(() => {
    const year = getCurrentYear();
    const points: LeaveTrendPoint[] = Array.from({ length: 12 }, (_, monthIndex) => ({
      month: toMonthLabel(monthIndex),
      totalLeaves: 0,
    }));

    for (const leave of filteredApprovedLeaves) {
      const leaveYear = getYearFromIso(leave.fromDate);
      if (leaveYear !== year) {
        continue;
      }

      const leaveMonth = getMonthIndexFromIso(leave.fromDate);
      if (leaveMonth !== null && leaveMonth >= 0 && leaveMonth < points.length) {
        points[leaveMonth].totalLeaves += 1;
      }
    }

    return points;
  }, [filteredApprovedLeaves]);

  const loading = leavesLoading || departmentsLoading || usersLoading;
  const error = leavesError || departmentsError || usersError;

  function handleExportLeavesAvailedPdf() {
    generateLeavesAvailedPdf({
      rows: leavesAvailedPdfRows,
      selectedDepartmentName,
      selectedDepartmentId,
      allDepartmentsValue: ALL_DEPARTMENTS,
    });
  }

  function handleExportLeavesAvailedExcel() {
    generateLeavesAvailedTimesheetExcel({
      users: filteredUsersForTimesheet,
      leaves: leavesForExcel,
      usersById,
      vendorsById,
      selectedDepartmentName,
      selectedDepartmentId,
      allDepartmentsValue: ALL_DEPARTMENTS,
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-[var(--app-surface)] p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--app-text)]">Reports</h1>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">Export and analyse leave data</p>
          </div>

          <div className="w-full sm:w-[260px]">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
              Department Filter
            </p>
            <Select value={selectedDepartmentId} onValueChange={setSelectedDepartmentId}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_DEPARTMENTS}>All Departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ReportActionCard
          title="Leaves Availed Report"
          description="All approved leaves with employee, vendor, and branch details"
          icon={<Download className="h-4 w-4" />}
          onExcel={handleExportLeavesAvailedExcel}
          onPdf={handleExportLeavesAvailedPdf}
          excelDisabled={loading || filteredUsersForTimesheet.length === 0}
          pdfDisabled={loading || leavesAvailedPdfRows.length === 0}
        />
        <ReportActionCard
          title="Leave Status Report"
          description="Complete leave requests with status breakdown and timelines"
          icon={<FileSpreadsheet className="h-4 w-4" />}
          onExcel={() => undefined}
          onPdf={() => undefined}
          excelDisabled
          pdfDisabled
        />
      </div>

      <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--app-text)]">
            Leave Trends ({selectedDepartmentName}) - {getCurrentYear()}
          </p>
          <p className="text-xs text-[var(--app-text-muted)]">Approved leaves per month</p>
        </div>

        {loading ? <p className="text-sm text-[var(--app-text-muted)]">Loading reports data...</p> : null}
        {error ? (
          <p className="text-sm text-[var(--app-error)]">Failed to load reports: {error.message}</p>
        ) : null}

        {!loading && !error ? (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  formatter={(value) => [`${String(value)} leaves`, 'Total Leaves']}
                  labelFormatter={(label) => `${String(label)} ${getCurrentYear()}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalLeaves"
                  name="Total Leaves"
                  stroke="var(--app-primary)"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2, fill: 'var(--app-white)' }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ReportActionCard({
  title,
  description,
  icon,
  onExcel,
  onPdf,
  excelDisabled,
  pdfDisabled,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  onExcel: () => void;
  onPdf: () => void;
  excelDisabled?: boolean;
  pdfDisabled?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
      <div className="inline-flex rounded-lg bg-[var(--app-electric-blue-1)] p-2 text-[var(--app-primary)]">{icon}</div>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--app-text)]">{title}</h2>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">{description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          className="h-8 bg-[var(--app-primary)] px-3 text-xs font-semibold text-[var(--app-white)] hover:bg-[var(--app-electric-blue-3)]"
          onClick={onExcel}
          disabled={excelDisabled}
        >
          <FileSpreadsheet className="mr-1 h-3.5 w-3.5" />
          Excel
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-8 px-3 text-xs"
          disabled={pdfDisabled}
          onClick={onPdf}
        >
          PDF
        </Button>
      </div>
    </section>
  );
}
