'use client';

import { useCurrentTimeGreetingMessage } from '../hooks/useCurrentTimeGreetingMessage';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function UserBanner() {
  const { userGreetingMessage } = useCurrentTimeGreetingMessage();
  const { userFullName, user } = useCurrentUser();

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[var(--app-black)] to-[var(--app-gray-800)] p-6 text-[var(--app-white)] shadow-sm">
      <p className="text-sm text-[var(--app-gray-700)]">{userGreetingMessage},</p>
      <h3 className="mt-1 text-3xl font-semibold text-[var(--app-white)]">{userFullName}</h3>
      <p className="mt-1 text-sm text-[var(--app-gray-700)]">
        {user?.userRole === 'Employee'
          ? 'Overview of leave and attendance activity.'
          : `${user?.designation}`}
      </p>
    </div>
  );
}
