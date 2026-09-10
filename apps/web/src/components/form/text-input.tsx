import { forwardRef, type InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/input';

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, ...props },
  ref,
) {
  return (
    <Input
      ref={ref}
      className={`h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] placeholder:opacity-100 focus:border-[var(--color-brand)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-soft)] ${className ?? ''}`}
      {...props}
    />
  );
});
