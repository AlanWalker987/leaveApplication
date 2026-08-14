'use client';

import Branch from '@/app/components/Branches/Branch';
import Department from '@/app/components/Departments/Department';
import LeaveType from '@/app/components/LeaveTypes/LeaveType';
import PublicHoliday from '@/app/components/PublicHolidays/PublicHoliday';
import User from '@/app/components/Users/User';
import Vendors from '@/app/components/Vendors/Vendors';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminUserConsolePage() {
  const pathname = usePathname();
  const router = useRouter();

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

  const selectedSubmenu =
    submenus.find((submenu) => submenu.path === pathname)?.name ?? submenus[0].name;

  return (
    <>
      <h1 className="mt-1 text-3xl font-semibold">Admin Console</h1>
      <p className="mt-1 text-md">Manage master data and configurations.</p>

      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8">
        <ToggleGroup
          type="single"
          value={selectedSubmenu}
          onValueChange={(value) => {
            if (value) {
              const selectedItem = submenus.find((submenu) => submenu.name === value);
              if (selectedItem && selectedItem.path !== pathname) {
                router.push(selectedItem.path);
              }
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
          {selectedSubmenu === 'departments' && <Department />}
          {selectedSubmenu === 'users' && <User />}
          {selectedSubmenu === 'vendors' && <Vendors />}
          {selectedSubmenu === 'branches' && <Branch />}
          {selectedSubmenu === 'publicHolidays' && <PublicHoliday />}
          {selectedSubmenu === 'leaveTypes' && <LeaveType />}
        </div>
      </div>
    </>
  );
}
