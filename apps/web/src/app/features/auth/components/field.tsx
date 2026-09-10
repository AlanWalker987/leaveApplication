import type { ReactNode } from 'react';

type FieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
};

export function Field({ label, required, error, children, className }: FieldProps) {
  return (
    <label
      className={`flex flex-col gap-1.5 text-[12px] font-semibold text-[var(--app-text)] md:text-[13px] ${className ?? ''}`}
    >
      <span className="leading-none">
        {label}
        {required ? <span className="ml-1 text-[var(--app-error)]">*</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs font-medium text-[var(--app-error)]">{error}</span> : null}
    </label>
  );
}
