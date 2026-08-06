import { forwardRef, type SelectHTMLAttributes } from 'react';

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement>;

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(function SelectInput(
  { className, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[color:var(--color-brand-soft)] ${className ?? ''}`}
      {...props}
    >
      {children}
    </select>
  );
});
