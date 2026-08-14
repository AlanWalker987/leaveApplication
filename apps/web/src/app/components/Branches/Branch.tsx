import { useQuery } from '@apollo/client';

import { GET_ALL_BRANCHES } from '@/app/graphql/admin/branches/branchOperations';
import {
  type GetAllBranchesAdminQuery,
  type GetAllBranchesAdminQueryVariables,
} from '@/gql/graphql';
import { DataTable } from '@/app/lib/data-table/data-table';
import { columns } from './branch-columns';
import { Button } from '@/components/ui/button';

export default function Branch() {
  const {
    data,
    loading: allBranchesLoading,
    error: allBranchesError,
  } = useQuery<GetAllBranchesAdminQuery, GetAllBranchesAdminQueryVariables>(GET_ALL_BRANCHES);

  const branches = data?.getBranches.results ?? [];

  if (allBranchesLoading) {
    return <p>Loading...</p>;
  }

  if (allBranchesError) {
    return <p>Error: {allBranchesError.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Branches</h1>
          <p className="text-sm text-slate-500">Manage and view all branches in the system.</p>
        </div>
        <Button className="text-md font-bold">+ Add Branch</Button>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={branches} />
      </div>
    </div>
  );
}
