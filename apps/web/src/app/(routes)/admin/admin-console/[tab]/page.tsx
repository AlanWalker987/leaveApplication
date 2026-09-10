import Branch from '@/app/components/Branches/Branch';
import Department from '@/app/components/Departments/Department';
import LeaveType from '@/app/components/LeaveTypes/LeaveType';
import PublicHoliday from '@/app/components/PublicHolidays/PublicHoliday';
import User from '@/app/components/Users/User';
import Vendors from '@/app/components/Vendors/Vendors';
import { notFound } from 'next/navigation';

type AdminConsoleTabPageProps = {
  params: Promise<{ tab: string }>;
};

export default async function AdminConsoleTabPage({ params }: AdminConsoleTabPageProps) {
  const { tab } = await params;

  if (tab === 'departments') {
    return <Department />;
  }

  if (tab === 'users') {
    return <User />;
  }

  if (tab === 'vendors') {
    return <Vendors />;
  }

  if (tab === 'branches') {
    return <Branch />;
  }

  if (tab === 'public-holidays') {
    return <PublicHoliday />;
  }

  if (tab === 'leave-types') {
    return <LeaveType />;
  }

  notFound();
}
