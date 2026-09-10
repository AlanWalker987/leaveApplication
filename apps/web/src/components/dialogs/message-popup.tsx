'use client';

import { useEffect, useState } from 'react';

type MessagePopupProps = {
  open: boolean;
  message: string;
  tone?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  onClose: () => void;
};

export function MessagePopup({ open, message, tone = 'info', title, onClose }: MessagePopupProps) {
  const ANIMATION_MS = 220;
  const [isRendered, setIsRendered] = useState(open);
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setIsRendered(true);
      const frameId = requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
    }

    setIsVisible(false);
    const timeoutId = window.setTimeout(() => {
      setIsRendered(false);
    }, ANIMATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [open]);

  if (!isRendered) {
    return null;
  }

  const toneStyles = {
    error: {
      ring: 'ring-[var(--app-error)]',
      iconBg: 'bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))]',
      iconText: 'text-[var(--app-error)]',
      title: 'text-[var(--app-error)]',
      body: 'text-[var(--app-error)]',
    },
    success: {
      ring: 'ring-[var(--app-success)]',
      iconBg: 'bg-[color:color-mix(in_srgb,var(--app-success)_16%,var(--app-bg))]',
      iconText: 'text-[var(--app-success)]',
      title: 'text-[var(--app-success)]',
      body: 'text-[var(--app-success)]',
    },
    warning: {
      ring: 'ring-[var(--app-warning)]',
      iconBg: 'bg-[color:color-mix(in_srgb,var(--app-warning)_20%,var(--app-bg))]',
      iconText: 'text-[var(--app-warning)]',
      title: 'text-[var(--app-warning)]',
      body: 'text-[var(--app-warning)]',
    },
    info: {
      ring: 'ring-[var(--app-border)]',
      iconBg: 'bg-[var(--app-surface-2)]',
      iconText: 'text-[var(--app-text)]',
      title: 'text-[var(--app-text)]',
      body: 'text-[var(--app-text)]',
    },
  } as const;

  const selectedTone = toneStyles[tone];
  const fallbackTitle =
    tone === 'error'
      ? 'Error'
      : tone === 'success'
        ? 'Success'
        : tone === 'warning'
          ? 'Warning'
          : 'Info';
  const popupTitle = title ?? fallbackTitle;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? 'bg-[var(--app-black)]/35 opacity-100' : 'bg-[var(--app-black)]/0 opacity-0'
      }`}
    >
      <div
        aria-live="polite"
        aria-modal="true"
        className={`relative min-h-[124px] w-full max-w-md rounded-2xl bg-[var(--app-surface)] px-5 py-6 shadow-2xl ring-1 transition-all duration-200 ${selectedTone.ring} ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.98] opacity-0'
        }`}
        role="dialog"
      >
        <button
          aria-label="Close popup"
          className="absolute right-3 top-3 rounded-md p-1.5 text-[var(--app-text-muted)] transition hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]"
          onClick={onClose}
          type="button"
        >
          <svg fill="none" height="14" viewBox="0 0 24 24" width="14">
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${selectedTone.iconBg} ${selectedTone.iconText}`}
            >
              <svg fill="none" height="14" viewBox="0 0 24 24" width="14">
                <path
                  d="M12 8v5m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
            <div>
              <p className={`text-sm font-semibold ${selectedTone.title}`}>{popupTitle}</p>
              <p className={`mt-1 text-sm ${selectedTone.body}`}>{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ScenarioPopupProps = Omit<MessagePopupProps, 'tone'>;

export function SuccessPopup(props: ScenarioPopupProps) {
  return <MessagePopup tone="success" {...props} />;
}

export function ErrorPopup(props: ScenarioPopupProps) {
  return <MessagePopup tone="error" {...props} />;
}

export function WarningPopup(props: ScenarioPopupProps) {
  return <MessagePopup tone="warning" {...props} />;
}
