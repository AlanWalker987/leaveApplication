import { type GetAllVendorsQuery, type GetAllVendorsQueryVariables } from '@/gql/graphql';
import { useQuery } from '@apollo/client';

import { GET_ALL_VENDORS } from '../../graphql/admin/vendors/vendorOperations';
import { DataTable } from '../../lib/data-table/data-table';
import { columns } from './vendor-columns';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button';

export default function Vendors() {
  const {
    data,
    loading: allVendorsLoading,
    error: allError,
  } = useQuery<GetAllVendorsQuery, GetAllVendorsQueryVariables>(GET_ALL_VENDORS);

  const vendors = data?.getVendors.results ?? [];

  if (allVendorsLoading) {
    return <Loader />;
  }

  if (allError) {
    return <p>Error: {allError.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">Manage and view all vendors in the system.</p>
        </div>
        <Button className="text-md font-bold">+ Add Vendor</Button>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={vendors} />
      </div>
    </div>
  );
}
