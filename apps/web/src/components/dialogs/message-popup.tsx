'use client';

import { useEffect, useState } from 'react';

type MessagePopupProps = {
  open: boolean;
  message: string;
  tone?: 'error' | 'success' | 'info';
  onClose: () => void;
};

export function MessagePopup({ open, message, tone = 'info', onClose }: MessagePopupProps) {
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
      ring: 'ring-red-200',
      iconBg: 'bg-red-100',
      iconText: 'text-red-700',
      title: 'text-red-900',
      body: 'text-red-800',
    },
    success: {
      ring: 'ring-emerald-200',
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-700',
      title: 'text-emerald-900',
      body: 'text-emerald-800',
    },
    info: {
      ring: 'ring-slate-200',
      iconBg: 'bg-slate-100',
      iconText: 'text-slate-700',
      title: 'text-slate-900',
      body: 'text-slate-700',
    },
  } as const;

  const selectedTone = toneStyles[tone];
  const title = tone === 'error' ? 'Error' : tone === 'success' ? 'Success' : 'Info';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? 'bg-slate-900/35 opacity-100' : 'bg-slate-900/0 opacity-0'
      }`}
    >
      <div
        aria-live="polite"
        aria-modal="true"
        className={`relative min-h-[124px] w-full max-w-md rounded-2xl bg-white px-5 py-6 shadow-2xl ring-1 transition-all duration-200 ${selectedTone.ring} ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.98] opacity-0'
        }`}
        role="dialog"
      >
        <button
          aria-label="Close popup"
          className="absolute right-3 top-3 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
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
              <p className={`text-sm font-semibold ${selectedTone.title}`}>{title}</p>
              <p className={`mt-1 text-sm ${selectedTone.body}`}>{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
