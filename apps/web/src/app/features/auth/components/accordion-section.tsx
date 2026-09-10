import type { ReactNode } from 'react';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';

type AccordionSectionProps = {
  title: string;
  icon: ReactNode;
  open: boolean;
  hasError: boolean;
  showStatus: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function AccordionSection({
  title,
  icon,
  open,
  hasError,
  showStatus,
  onToggle,
  children,
}: AccordionSectionProps) {
  return (
    <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_1px_2px_rgba(13,26,58,0.04)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--app-electric-blue-1)] text-[var(--app-primary)]">
            {icon}
          </span>
          <span className="text-[14px] font-semibold text-[var(--app-text)]">{title}</span>
        </span>

        <span className="flex items-center gap-2">
          {showStatus ? (
            hasError ? (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--app-error)_15%,var(--app-bg))] text-[var(--app-error)]">
                <AlertCircle className="h-3 w-3" />
              </span>
            ) : (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--app-success)_18%,var(--app-bg))] text-[var(--app-success)]">
                <Check className="h-3 w-3" />
              </span>
            )
          ) : null}

          <ChevronDown
            size={14}
            className={`text-[var(--app-text-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {open ? (
        <div className="border-t border-[var(--app-border)] p-4 md:p-5">{children}</div>
      ) : null}
    </section>
  );
}
