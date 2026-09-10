'use client';

import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GET_ME } from '../graphql/operations';
import { clearAuthSession, hasAccessToken } from '../utils/session';

export function SamplePageFeature() {
  const router = useRouter();
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(hasAccessToken());
    setIsAuthResolved(true);
  }, []);

  const { data, loading, error } = useQuery(GET_ME, {
    skip: !isAuthResolved || !authenticated,
  });

  function onLogout() {
    clearAuthSession();
    router.push('/login');
  }

  if (!isAuthResolved) {
    return <main className="p-6">Loading profile...</main>;
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-surface-2)] px-4">
        <section className="w-full max-w-lg rounded-2xl bg-[var(--app-surface)] p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Session Not Found</h1>
          <p className="mt-2 text-sm text-[var(--app-text)]">Please login first to view the sample page.</p>
          <Link
            className="mt-5 inline-block rounded-md bg-[var(--app-black)] px-4 py-2 font-semibold text-[var(--app-white)]"
            href="/login"
          >
            Go to Login
          </Link>
        </section>
      </main>
    );
  }

  if (loading) {
    return <main className="p-6">Loading profile...</main>;
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-surface-2)] px-4">
        <section className="w-full max-w-xl rounded-2xl bg-[var(--app-surface)] p-8 shadow-md">
          <h1 className="text-xl font-bold text-[var(--app-text)]">Could not load profile</h1>
          <p className="mt-2 text-sm text-[var(--app-error)]">{error.message}</p>
          <div className="mt-5 flex gap-3">
            <button
              className="rounded-md bg-[var(--app-black)] px-4 py-2 font-semibold text-[var(--app-white)]"
              onClick={onLogout}
              type="button"
            >
              Logout
            </button>
            <Link
              className="rounded-md bg-[var(--app-surface-2)] px-4 py-2 font-semibold text-[var(--app-text)]"
              href="/login"
            >
              Login Again
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const user = data?.me;

  return (
    <main className="min-h-screen bg-[var(--app-surface-2)] px-4 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl bg-[var(--app-surface)] p-8 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Sample Page</h1>
          <button
            className="rounded-md bg-[var(--app-black)] px-4 py-2 text-sm font-semibold text-[var(--app-white)]"
            onClick={onLogout}
            type="button"
          >
            Logout
          </button>
        </div>

        <p className="mt-2 text-sm text-[var(--app-text)]">
          Authenticated user data loaded from GraphQL me query.
        </p>

        {user ? (
          <dl className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-[var(--app-border)] p-4 md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-[var(--app-text-muted)]">Name</dt>
              <dd className="text-sm font-semibold text-[var(--app-text)]">
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[var(--app-text-muted)]">Email</dt>
              <dd className="text-sm font-semibold text-[var(--app-text)]">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[var(--app-text-muted)]">Role</dt>
              <dd className="text-sm font-semibold text-[var(--app-text)]">{user.userRole}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[var(--app-text-muted)]">Designation</dt>
              <dd className="text-sm font-semibold text-[var(--app-text)]">{user.designation}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[var(--app-text-muted)]">Branch ID</dt>
              <dd className="text-sm font-semibold text-[var(--app-text)]">{user.branchId}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[var(--app-text-muted)]">Vendor ID</dt>
              <dd className="text-sm font-semibold text-[var(--app-text)]">{user.vendorId}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-sm text-[var(--app-text)]">No user profile returned.</p>
        )}
      </section>
    </main>
  );
}
