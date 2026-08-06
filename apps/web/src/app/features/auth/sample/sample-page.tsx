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
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-slate-900">Session Not Found</h1>
          <p className="mt-2 text-sm text-slate-600">Please login first to view the sample page.</p>
          <Link
            className="mt-5 inline-block rounded-md bg-slate-900 px-4 py-2 font-semibold text-white"
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
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-md">
          <h1 className="text-xl font-bold text-slate-900">Could not load profile</h1>
          <p className="mt-2 text-sm text-red-700">{error.message}</p>
          <div className="mt-5 flex gap-3">
            <button
              className="rounded-md bg-slate-900 px-4 py-2 font-semibold text-white"
              onClick={onLogout}
              type="button"
            >
              Logout
            </button>
            <Link
              className="rounded-md bg-slate-200 px-4 py-2 font-semibold text-slate-900"
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
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Sample Page</h1>
          <button
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={onLogout}
            type="button"
          >
            Logout
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Authenticated user data loaded from GraphQL me query.
        </p>

        {user ? (
          <dl className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-slate-500">Name</dt>
              <dd className="text-sm font-semibold text-slate-900">
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Email</dt>
              <dd className="text-sm font-semibold text-slate-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Role</dt>
              <dd className="text-sm font-semibold text-slate-900">{user.userRole}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Designation</dt>
              <dd className="text-sm font-semibold text-slate-900">{user.designation}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Branch ID</dt>
              <dd className="text-sm font-semibold text-slate-900">{user.branchId}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Vendor ID</dt>
              <dd className="text-sm font-semibold text-slate-900">{user.vendorId}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-sm text-slate-600">No user profile returned.</p>
        )}
      </section>
    </main>
  );
}
