'use client';

import { useCurrentTimeGreetingMessage } from '../hooks/useCurrentTimeGreetingMessage';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function EmployeeBanner() {
  const { userGreetingMessage } = useCurrentTimeGreetingMessage();
  const { userFullName } = useCurrentUser();

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] p-6 text-white shadow-sm">
      <p className="text-sm text-blue-100">{userGreetingMessage},</p>
      <h3 className="mt-1 text-3xl font-semibold text-white">{userFullName}</h3>
      <p className="mt-1 text-sm text-blue-100">Overview of leave and attendance activity.</p>
    </div>
  );
}
