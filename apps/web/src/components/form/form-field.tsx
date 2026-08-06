import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  children: ReactNode;
  error?: string;
  className?: string;
};

export function FormField({ label, children, error, className = '' }: FormFieldProps) {
  return (
    <label
      className={`flex flex-col gap-1 text-sm font-semibold text-[var(--color-ink)] ${className}`}
    >
      <span className="tracking-[0.01em]">{label}</span>
      {children}
      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
    </label>
  );
}
