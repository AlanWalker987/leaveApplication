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
  { path: '/admin/leaves-availed', label: 'Leaves Availed' },
  { path: '/admin/leave-status', label: 'Leave Status' },
  { path: '/admin/leave-approval', label: 'Leave Approval' },
  { path: '/admin/admin-console', label: 'Admin Console' },
  { path: '/admin/reports', label: 'Reports' },
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
    <main className="min-h-screen bg-[#f8f8f8] text-[#1b1b1b]">
      <header className="flex h-14 items-center justify-between border-b border-[#e6e6e6] bg-white px-4 md:px-6">
        <div className="flex items-center justify-center gap-3 text-center">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#101010] text-sm font-bold text-white">
            L
          </span>
          <p className="text-[15px] font-semibold text-[#1b1b1b]">Leave Management System</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#f8f8f8] px-3 py-1 text-xs font-medium text-[#575757]">
            Admin
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

      <section className="grid h-[calc(100vh-56px)] grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r border-[#e6e6e6] bg-white p-3 text-[#101010] overflow-y-auto">
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active =
                pathname === item.path ||
                (item.path !== '/admin' && pathname.startsWith(item.path + '/'));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition duration-200 ${
                    active
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="overflow-y-auto p-6 md:p-8">{children}</section>
      </section>
    </main>
  );
}
