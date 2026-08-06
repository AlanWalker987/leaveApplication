import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  maxWidthClassName?: string;
  actionLabel?: string;
  actionHref?: string;
  centered?: boolean;
  hideHeader?: boolean;
  fullPage?: boolean;
  frame?: 'card' | 'plain';
};

export function AuthShell({
  title,
  description,
  children,
  maxWidthClassName = 'max-w-4xl',
  actionLabel,
  actionHref,
  centered = false,
  hideHeader = false,
  fullPage = false,
  frame = 'card',
}: AuthShellProps) {
  const header = hideHeader ? null : (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[var(--color-ink)] md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>
      </div>
      {actionLabel && actionHref ? (
        <Link
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-brand-deep)] transition hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      ) : null}
    </header>
  );

  return (
    <main
      className={`relative ${fullPage ? 'h-[100svh] md:h-[100dvh] overflow-hidden' : 'min-h-screen px-4 py-10'} ${centered ? 'flex items-center justify-center' : ''}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-[var(--color-brand-soft)] blur-2xl" />
        <div className="absolute -right-12 bottom-20 h-56 w-56 rounded-full bg-[var(--color-brand-soft)] blur-3xl" />
      </div>

      {frame === 'card' ? (
        <section
          className={`relative mx-auto w-full ${maxWidthClassName} ${fullPage ? 'h-full' : ''} rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-strong)] md:p-8`}
        >
          {header}
          {children}
        </section>
      ) : (
        <section className={`relative mx-auto h-full w-full ${maxWidthClassName}`}>
          {header}
          {children}
        </section>
      )}
    </main>
  );
}
