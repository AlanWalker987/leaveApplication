'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import {
  clearAuthSession,
  getRoleHomePath,
  getUserRoleFromSession,
  hasAccessToken,
} from '../../features/auth/utils/session';

type AdminLayoutProps = {
  children: ReactNode;
};

const menuItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/user-management', label: 'User Management' },
  { path: '/admin/leave-policies', label: 'Leave Policies' },
] as const;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Manager' | 'Employee' | null>(null);

  useEffect(() => {
    setIsAuthenticated(hasAccessToken());
    setCurrentRole(getUserRoleFromSession());
    setIsAuthResolved(true);
  }, []);

  useEffect(() => {
    if (!isAuthResolved || !isAuthenticated || !currentRole) {
      return;
    }

    if (currentRole !== 'Admin') {
      router.replace(getRoleHomePath(currentRole));
    }
  }, [currentRole, isAuthResolved, isAuthenticated, router]);

  function onLogout() {
    clearAuthSession();
    router.push('/login');
  }

  if (!isAuthResolved) {
    return <main className="p-6">Loading...</main>;
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-slate-900">Session Not Found</h1>
          <p className="mt-2 text-sm text-slate-600">Please login first to continue.</p>
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

  if (!currentRole || currentRole !== 'Admin') {
    return <main className="p-6">Redirecting...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#0f172a]">
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#1d4ed8] text-sm font-bold text-white">
            L
          </span>
          <p className="text-[15px] font-semibold text-slate-900">Leave Management System</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            Admin
          </span>
          <button
            type="button"
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-56px)] grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r border-slate-200 bg-[#1f2937] p-3 text-slate-100">
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                    active
                      ? 'bg-slate-600/60 font-semibold text-white'
                      : 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="p-4 md:p-5">{children}</section>
      </section>
    </main>
  );
}
