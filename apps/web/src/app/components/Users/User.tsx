import { GetAllUsersQuery, GetAllUsersQueryVariables } from '@/gql/graphql';
import { GET_ALL_USERS } from '../../graphql/admin/users/userOperations';
import { useQuery } from '@apollo/client';
import { columns } from '../Users/user-columns';
import { DataTable } from '../../lib/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader/Loader';

export default function User() {
  const {
    data,
    loading: allUsersLoading,
    error: allUsersError,
  } = useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GET_ALL_USERS);

  const users = data?.getAllUsers.results ?? [];

  if (allUsersLoading) {
    return <Loader />;
  }

  if (allUsersError) {
    return <p>Error: {allUsersError.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">Manage and view all users in the system.</p>
        </div>
        <Button className="text-md font-bold">+ Add User</Button>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
