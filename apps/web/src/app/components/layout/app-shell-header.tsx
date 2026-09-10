'use client';

import { ThemeToggle } from 'company-theme';
import { Bell, CalendarDays, LogOut, Menu } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

type AppShellHeaderProps = {
  roleLabel: 'Admin' | 'Manager' | 'Employee';
  userName?: string | null;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
  sidebarTrigger?: ReactNode;
};

export function AppShellHeader({
  roleLabel,
  userName,
  onLogout,
  onToggleSidebar,
  showSidebarToggle = true,
  sidebarTrigger,
}: AppShellHeaderProps) {
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
  const logoutMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocumentPointerDown(event: PointerEvent) {
      if (!logoutMenuRef.current) {
        return;
      }

      if (!logoutMenuRef.current.contains(event.target as Node)) {
        setIsLogoutMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', onDocumentPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onDocumentPointerDown);
    };
  }, []);

  const initials =
    userName
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || roleLabel[0];

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-bg)] px-3 md:px-5">
      <div className="flex items-center gap-2.5">
        {showSidebarToggle
          ? (sidebarTrigger ?? (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--app-text)] transition hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>
            ))
          : null}
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--app-black)] text-[var(--app-white)]">
          <CalendarDays className="h-4 w-4" />
        </span>
        <span className="inline-flex h-8 translate-y-[0.5px] items-center text-[15px] font-semibold leading-none text-[var(--app-text)]">
          Leave management system
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <button
          type="button"
          className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--app-text)] transition hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--app-error)]" />
        </button>

        <ThemeToggle />

        <div className="flex h-8 items-center gap-2 pl-1">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--app-black)] text-[11px] font-semibold leading-none text-[var(--app-white)]">
            {initials}
          </span>
          <span className="flex h-8 max-w-[280px] items-center gap-1.5 truncate text-sm font-medium text-[var(--app-text)]">
            <span className="truncate">{userName ?? roleLabel}</span>
            <span className="inline-flex h-6 items-center rounded-full bg-[var(--app-gold-1)] px-2.5 text-xs font-semibold text-[var(--app-gold-3)]">
              {roleLabel}
            </span>
          </span>
        </div>

        <div className="relative" ref={logoutMenuRef}>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--app-text)] transition hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]"
            onClick={() => setIsLogoutMenuOpen((prev) => !prev)}
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
          {isLogoutMenuOpen && (
            <div className="absolute right-0 top-10 z-50 min-w-[132px] rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-1.5 shadow-lg">
              <button
                type="button"
                className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-[var(--app-error)] transition hover:bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] hover:text-[var(--app-error)]"
                onClick={() => {
                  setIsLogoutMenuOpen(false);
                  onLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
