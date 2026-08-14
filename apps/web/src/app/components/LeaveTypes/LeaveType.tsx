'use client';

import { useQuery } from '@apollo/client';
import { GetAllLeaveTypesQuery, GetAllLeaveTypesQueryVariables } from '@/gql/graphql';
import { DataTable } from '@/app/lib/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader/Loader';

import { columns } from './leave-type-columns';
import { GET_ALL_LEAVE_TYPES } from '@/app/graphql/admin/leaveTypes/leaveTypeOperations';

export default function LeaveType() {
  const {
    data,
    loading: allLeaveTypesLoading,
    error: allLeaveTypesError,
  } = useQuery<GetAllLeaveTypesQuery, GetAllLeaveTypesQueryVariables>(GET_ALL_LEAVE_TYPES);

  const leaveTypes = data?.getLeaveTypes.results ?? [];

  if (allLeaveTypesLoading) {
    return <Loader />;
  }

  if (allLeaveTypesError) {
    return <p>Error: {allLeaveTypesError.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Leave Types</h1>
          <p className="text-sm text-slate-500">Manage and view all leave types in the system.</p>
        </div>
        <Button className="text-md font-bold">+ Add Leave Type</Button>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={leaveTypes} />
      </div>
    </div>
  );
}
