'use client';

import { useCurrentTimeGreetingMessage } from '../hooks/useCurrentTimeGreetingMessage';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function EmployeeBanner() {
  const { userGreetingMessage } = useCurrentTimeGreetingMessage();
  const { userFullName, user } = useCurrentUser();

  return (
    <div className="rounded-2xl bg-gradient-to-r bg-[#101010] p-6 text-white shadow-sm">
      <p className="text-sm text-blue-100">{userGreetingMessage},</p>
      <h3 className="mt-1 text-3xl font-semibold text-white">{userFullName}</h3>
      <p className="mt-1 text-sm text-blue-100">
        {user?.userRole === 'Employee'
          ? 'Overview of leave and attendance activity.'
          : `${user?.designation}`}
      </p>
    </div>
  );
}
