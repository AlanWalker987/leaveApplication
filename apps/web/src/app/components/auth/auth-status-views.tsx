'use client';

import Link from 'next/link';

type LoadingStateViewProps = {
  message?: string;
};

export function LoadingStateView({ message = 'Loading...' }: LoadingStateViewProps) {
  return <main className="p-6">{message}</main>;
}

type RedirectingStateViewProps = {
  message?: string;
};

export function RedirectingStateView({ message = 'Redirecting...' }: RedirectingStateViewProps) {
  return <main className="p-6">{message}</main>;
}

export function SessionNotFoundView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-surface-2)] px-4">
      <section className="w-full max-w-lg rounded-2xl bg-[var(--app-surface)] p-8 text-center shadow-md">
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Session Not Found</h1>
        <p className="mt-2 text-sm text-[var(--app-text)]">Please login first to continue.</p>
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

type RoleResolutionErrorViewProps = {
  onLogout: () => void;
};

export function RoleResolutionErrorView({ onLogout }: RoleResolutionErrorViewProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-surface-2)] px-4">
      <section className="w-full max-w-xl rounded-2xl bg-[var(--app-surface)] p-8 shadow-md">
        <h1 className="text-xl font-bold text-[var(--app-text)]">Unable to resolve user role</h1>
        <p className="mt-2 text-sm text-[var(--app-text)]">Please login again to continue.</p>
        <button
          className="mt-5 rounded-md bg-[var(--app-black)] px-4 py-2 font-semibold text-[var(--app-white)]"
          onClick={onLogout}
          type="button"
        >
          Logout
        </button>
      </section>
    </main>
  );
}
