import type { ButtonHTMLAttributes } from 'react';

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  idleLabel: string;
  loadingLabel: string;
  loading: boolean;
};

export function SubmitButton({
  idleLabel,
  loadingLabel,
  loading,
  className,
  ...buttonProps
}: SubmitButtonProps) {
  return (
    <button
      className={`rounded-md bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 ${className ?? ''}`}
      disabled={loading || buttonProps.disabled}
      type="submit"
      {...buttonProps}
    >
      {loading ? loadingLabel : idleLabel}
    </button>
  );
}
