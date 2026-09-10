'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { BarChart3, ClipboardCheck, LayoutDashboard, ListChecks, Shield } from 'lucide-react';
import {
  clearAuthSession,
  getRoleHomePath,
  getUserRoleFromSession,
  hasAccessToken,
} from '../../features/auth/utils/session';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { AppShellHeader } from '@/app/components/layout/app-shell-header';
import { Loader } from '@/components/loader/Loader';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { TourTarget } from 'company-user-tour';
import {
  LoadingStateView,
  RedirectingStateView,
  SessionNotFoundView,
} from '@/app/components/auth/auth-status-views';
import { ConfirmActionDialog } from '@/components/dialogs/confirm-action-dialog';

type AdminLayoutProps = {
  children: ReactNode;
};

const menuItems = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    tourTargetId: 'admin-sidebar-dashboard',
  },
  {
    path: '/admin/leaves-availed',
    label: 'Leaves Availed',
    icon: ClipboardCheck,
    tourTargetId: 'admin-sidebar-leaves-availed',
  },
  {
    path: '/admin/leave-status',
    label: 'Leave Status',
    icon: ListChecks,
    tourTargetId: 'admin-sidebar-leave-status',
  },
  {
    path: '/admin/admin-console',
    label: 'Admin Console',
    icon: Shield,
    tourTargetId: 'admin-sidebar-admin-console',
  },
  {
    path: '/admin/reports',
    label: 'Reports',
    icon: BarChart3,
    tourTargetId: 'admin-sidebar-reports',
  },
] as const;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Manager' | 'Employee' | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pendingMenuPath, setPendingMenuPath] = useState<string | null>(null);
  const { user } = useCurrentUser({ skip: !isAuthenticated });

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

  useEffect(() => {
    setIsNavigating(false);
    setPendingMenuPath(null);
  }, [pathname]);

  function onLogout() {
    clearAuthSession();
    router.push('/login');
  }

  function onRequestLogout() {
    setIsLogoutConfirmOpen(true);
  }

  function isPathActive(path: string) {
    return pathname === path || (path !== '/admin' && pathname.startsWith(path + '/'));
  }

  function isMenuItemActive(path: string) {
    if (pendingMenuPath) {
      return pendingMenuPath === path;
    }

    return isPathActive(path);
  }

  function onMenuItemClick(path: string) {
    if (!isPathActive(path)) {
      setPendingMenuPath(path);
      setIsNavigating(true);
    }
  }

  if (!isAuthResolved) {
    return <LoadingStateView />;
  }

  if (!isAuthenticated) {
    return <SessionNotFoundView />;
  }

  if (!currentRole || currentRole !== 'Admin') {
    return <RedirectingStateView />;
  }

  return (
    <SidebarProvider defaultOpen>
      <main className="flex h-screen w-full min-w-0 flex-1 flex-col overflow-hidden bg-[var(--app-surface)] text-[var(--app-text)]">
        <AppShellHeader
          roleLabel="Admin"
          userName={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || null}
          onLogout={onRequestLogout}
          showSidebarToggle
          sidebarTrigger={
            <SidebarTrigger className="h-8 w-8 rounded-md text-[var(--app-text)] transition hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]" />
          }
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar
            collapsible="icon"
            className="top-14 h-[calc(100svh-56px)] border-r border-[var(--app-border)] bg-[var(--app-white)]"
          >
            <SidebarContent className="p-3">
              <SidebarGroup className="p-0">
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1.5">
                    {menuItems.map((item) => {
                      const active = isMenuItemActive(item.path);
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.path}>
                          <TourTarget id={item.tourTargetId}>
                            <SidebarMenuButton
                              asChild
                              isActive={active}
                              tooltip={item.label}
                              className={cn(
                                'h-auto rounded-lg px-3 py-2.5 text-sm text-[var(--app-black)] transition',
                                'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:[&>span]:hidden',
                                'data-[active=true]:bg-[var(--app-black)] data-[active=true]:font-semibold data-[active=true]:text-[var(--app-white)]',
                                'hover:bg-[var(--app-black)] hover:text-[var(--app-white)] active:bg-[var(--app-black)] active:text-[var(--app-white)]',
                              )}
                            >
                              <Link href={item.path} onClick={() => onMenuItemClick(item.path)}>
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </TourTarget>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="relative min-w-0 overflow-y-auto bg-[var(--app-surface)] p-4 md:p-5">
            {children}
            {isNavigating ? (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--app-surface)]">
                <Loader />
              </div>
            ) : null}
          </SidebarInset>
        </div>

        <ConfirmActionDialog
          open={isLogoutConfirmOpen}
          onOpenChange={setIsLogoutConfirmOpen}
          title="Logout"
          description="Are you sure you want to logout?"
          onConfirm={onLogout}
          confirmLabel="Logout"
          variant="danger"
        />
      </main>
    </SidebarProvider>
  );
}
