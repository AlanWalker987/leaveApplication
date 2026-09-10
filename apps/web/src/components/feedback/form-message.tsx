type FormMessageProps = {
  message: string;
  tone?: 'error' | 'success' | 'info';
  className?: string;
};

export function FormMessage({ message, tone = 'error', className = '' }: FormMessageProps) {
  const toneClasses = {
    error: 'bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] text-[var(--app-error)]',
    success: 'bg-[color:color-mix(in_srgb,var(--app-success)_16%,var(--app-bg))] text-[var(--app-success)]',
    info: 'bg-[var(--app-surface-2)] text-[var(--app-text)]',
  } as const;

  return <p className={`rounded-md p-3 text-sm ${toneClasses[tone]} ${className}`}>{message}</p>;
}
