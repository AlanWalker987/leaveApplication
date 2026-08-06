type FormMessageProps = {
  message: string;
  tone?: 'error' | 'success' | 'info';
  className?: string;
};

export function FormMessage({ message, tone = 'error', className = '' }: FormMessageProps) {
  const toneClasses = {
    error: 'bg-red-50 text-red-700',
    success: 'bg-green-50 text-green-700',
    info: 'bg-slate-100 text-slate-700',
  } as const;

  return <p className={`rounded-md p-3 text-sm ${toneClasses[tone]} ${className}`}>{message}</p>;
}
