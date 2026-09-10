'use client';

import { Loader } from '@/components/loader/Loader';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

type AdminConsoleLayoutProps = {
  children: ReactNode;
};

const submenus: { displayText: string; name: string; path: string }[] = [
  { displayText: 'Departments', name: 'departments', path: '/admin/admin-console/departments' },
  { displayText: 'Users', name: 'users', path: '/admin/admin-console/users' },
  { displayText: 'Vendors', name: 'vendors', path: '/admin/admin-console/vendors' },
  { displayText: 'Branches', name: 'branches', path: '/admin/admin-console/branches' },
  {
    displayText: 'Public Holidays',
    name: 'publicHolidays',
    path: '/admin/admin-console/public-holidays',
  },
  { displayText: 'Leave Types', name: 'leaveTypes', path: '/admin/admin-console/leave-types' },
];

function getSelectedSubmenuName(pathname: string) {
  if (pathname === '/admin/admin-console') {
    return 'departments';
  }

  return submenus.find((submenu) => submenu.path === pathname)?.name ?? 'departments';
}

export default function AdminConsoleLayout({ children }: AdminConsoleLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isTabNavigating, setIsTabNavigating] = useState(false);
  const selectedSubmenu = getSelectedSubmenuName(pathname);

  useEffect(() => {
    setIsTabNavigating(false);
  }, [pathname]);

  useEffect(() => {
    for (const submenu of submenus) {
      router.prefetch(submenu.path);
    }
  }, [router]);

  return (
    <>
      <h1 className="mt-1 text-2xl font-semibold text-[var(--app-text)]">Admin Console</h1>
      <p className="mt-1 text-md">Manage master data and configurations.</p>

      <div className="mt-5 rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-8">
        <ToggleGroup
          type="single"
          value={selectedSubmenu}
          onValueChange={(value) => {
            if (!value) {
              return;
            }

            const selectedItem = submenus.find((submenu) => submenu.name === value);
            if (selectedItem && selectedItem.path !== pathname) {
              setIsTabNavigating(true);
              router.push(selectedItem.path);
            }
          }}
          className="flex flex-wrap gap-2"
        >
          {submenus.map((submenu) => (
            <ToggleGroupItem key={submenu.name} value={submenu.name}>
              {submenu.displayText}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="mt-4">
          {isTabNavigating ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-xl bg-[var(--app-surface)]/80">
              <Loader />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </>
  );
}
