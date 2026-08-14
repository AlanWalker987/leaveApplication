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

type ManagerLayoutProps = {
  children: ReactNode;
};

const menuItems = [
  { path: '/manager', label: 'Dashboard' },
  { path: '/manager/team-approvals', label: 'Team Approvals' },
  { path: '/manager/team-calendar', label: 'Team Calendar' },
] as const;

export default function ManagerLayout({ children }: ManagerLayoutProps) {
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

    if (currentRole !== 'Manager') {
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

  if (!currentRole || currentRole !== 'Manager') {
    return <main className="p-6">Redirecting...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8] text-[#1b1b1b]">
      <header className="flex h-14 items-center justify-between border-b border-[#e6e6e6] bg-white px-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#101010] text-sm font-bold text-white">
            L
          </span>
          <p className="flex h-8 items-center text-[15px] font-semibold leading-none text-[#1b1b1b]">
            Leave Management System
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#f8f8f8] px-3 py-1 text-xs font-medium text-[#575757]">
            Manager
          </span>
          <button
            type="button"
            className="rounded-md border border-[#e6e6e6] bg-white px-3 py-1.5 text-xs font-semibold text-[#575757] hover:bg-[#f8f8f8]"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-56px)] grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r border-[#e6e6e6] bg-[#ffffff] p-3 text-[#101010]">
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                    active
                      ? 'bg-[#101010] font-semibold text-[#ffffff]'
                      : 'text-[#101010] hover:bg-[#101010] hover:text-[#ffffff] active:bg-[#101010] active:text-[#ffffff]'
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
