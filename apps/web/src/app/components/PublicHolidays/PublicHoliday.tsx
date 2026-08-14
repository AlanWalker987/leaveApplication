'use client';

import { useQuery } from '@apollo/client';

import { GET_ALL_PUBLIC_HOLIDAYS } from '@/app/graphql/admin/publicHolidays/publicHolidayOperations';
import {
  type GetAllPublicHolidaysQuery,
  type GetAllPublicHolidaysQueryVariables,
} from '@/gql/graphql';
import { DataTable } from '@/app/lib/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader/Loader';

import { columns } from './public-holiday-columns';

export default function PublicHoliday() {
  const {
    data,
    loading: allPublicHolidayLoading,
    error: allPublicHolidayError,
  } = useQuery<GetAllPublicHolidaysQuery, GetAllPublicHolidaysQueryVariables>(
    GET_ALL_PUBLIC_HOLIDAYS,
  );

  const holidays = data?.getPublicHolidays.results ?? [];

  if (allPublicHolidayLoading) {
    return <Loader />;
  }

  if (allPublicHolidayError) {
    return <p>Error: {allPublicHolidayError.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Public Holidays</h1>
          <p className="text-sm text-slate-500">Manage and view all holidays for the year.</p>
        </div>
        <Button className="text-md font-bold">+ Add Holiday</Button>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={holidays} />
      </div>
    </div>
  );
}
