import type { ReactNode } from 'react';

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
    <section className="rounded-2xl border border-[#e3e9f4] bg-white shadow-[0_1px_2px_rgba(13,26,58,0.04)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f3f0ff] text-[#6246ea]">
            {icon}
          </span>
          <span className="text-[14px] font-semibold text-[#1d2740]">{title}</span>
        </span>

        <span className="flex items-center gap-2">
          {showStatus ? (
            hasError ? (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#fee2e2] text-[#dc2626]">
                <svg fill="none" height="12" viewBox="0 0 24 24" width="12">
                  <path
                    d="M12 8v5m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
            ) : (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
                <svg fill="none" height="12" viewBox="0 0 24 24" width="12">
                  <path
                    d="m6 12 4 4 8-8"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
            )
          ) : null}

          <svg
            fill="none"
            height="14"
            viewBox="0 0 24 24"
            width="14"
            className={`text-[#64748b] transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </span>
      </button>

      {open ? <div className="border-t border-[#eef2f8] p-4 md:p-5">{children}</div> : null}
    </section>
  );
}
