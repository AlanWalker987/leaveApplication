# company-theme Integration Guide (apps/web)

This guide shows how to use the installed `company-theme` package in this Next.js app, including:

- Global CSS import
- `ThemeProvider` setup
- `useTheme` hook usage
- Theme types (`Theme`, `ThemeContextValue`)
- `ThemeContext` usage
- Toggle UI example
- Real TSX usage patterns

## 1. Available Exports

From `company-theme`, you currently have:

- `ThemeProvider`
- `useTheme`
- `ThemeContext`
- `Theme` and `ThemeContextValue` types
- CSS entry: `company-theme/styles.css`

## 2. Import Global Theme CSS

Import once in the app root layout.

```tsx
// src/app/layout.tsx
import 'react-day-picker/style.css';
import 'company-theme/styles.css';
import './globals.css';
import '../styles/main.scss';
```

Why this matters:

- `company-theme/styles.css` provides the `:root`, `[data-theme="light"]`, and `[data-theme="dark"]` color variables.
- Components can reference these tokens like `var(--app-bg)`, `var(--app-text)`, `var(--app-primary)`.

## 3. Wrap App with ThemeProvider

Use provider in your client providers wrapper.

```tsx
// src/app/providers/app-providers.tsx
'use client';

import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'company-theme';
import { useMemo, type ReactNode } from 'react';
import { createApolloClient } from '../lib/apollo-client';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const client = useMemo(() => createApolloClient(), []);

  return (
    <ThemeProvider defaultTheme="system">
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ThemeProvider>
  );
}
```

`defaultTheme` accepts:

- `"light"`
- `"dark"`
- `"system"`

## 4. useTheme Hook in TSX (Client Component)

`useTheme` must be used in a client component and inside `ThemeProvider`.

```tsx
'use client';

import { useTheme, type Theme } from 'company-theme';

const THEME_CYCLE: Theme[] = ['light', 'dark', 'system'];

export function ThemeToggleButton() {
  const { theme, setTheme, resolveTheme } = useTheme();

  function cycleTheme() {
    const current = THEME_CYCLE.indexOf(theme);
    const next = THEME_CYCLE[(current + 1) % THEME_CYCLE.length];
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={`theme=${theme}, resolved=${resolveTheme}`}
      className="rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
    >
      Theme: {theme} ({resolveTheme})
    </button>
  );
}
```

## 5. Full Toggle UI Example (Segmented Control)

```tsx
'use client';

import { useTheme, type Theme } from 'company-theme';

const OPTIONS: Theme[] = ['light', 'dark', 'system'];

export function ThemeToggleGroup() {
  const { theme, setTheme, resolveTheme } = useTheme();

  return (
    <section className="inline-flex items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-1">
      {OPTIONS.map((option) => {
        const active = option === theme;

        return (
          <button
            key={option}
            type="button"
            onClick={() => setTheme(option)}
            className={[
              'rounded-lg px-3 py-1.5 text-sm transition',
              active
                ? 'bg-[var(--app-primary)] text-[var(--app-primary-contrast)]'
                : 'bg-transparent text-[var(--app-text)] hover:bg-[var(--app-surface-2)]',
            ].join(' ')}
            aria-pressed={active}
          >
            {option}
          </button>
        );
      })}

      <span className="ml-2 text-xs text-[var(--app-text-muted)]">resolved: {resolveTheme}</span>
    </section>
  );
}
```

## 6. Type Usage

```tsx
import type { Theme, ThemeContextValue } from 'company-theme';

const allowedThemes: Theme[] = ['light', 'dark', 'system'];

function persistTheme(data: ThemeContextValue) {
  localStorage.setItem('theme', data.theme);
}
```

## 7. Optional: ThemeContext Usage

Prefer `useTheme`, but `ThemeContext` is available.

```tsx
'use client';

import { useContext } from 'react';
import { ThemeContext } from 'company-theme';

export function ThemeDebug() {
  const context = useContext(ThemeContext);

  if (!context) {
    return null;
  }

  return (
    <pre className="text-xs text-[var(--app-text-muted)]">{JSON.stringify(context, null, 2)}</pre>
  );
}
```

## 8. Use Theme Tokens in Styles

Use company-theme tokens directly in class names or CSS:

```tsx
<div className="bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)]" />
```

Common tokens:

- `--app-bg`
- `--app-surface`
- `--app-surface-2`
- `--app-text`
- `--app-text-muted`
- `--app-border`
- `--app-primary`
- `--app-primary-contrast`
- `--app-success`
- `--app-warning`
- `--app-error`

## 9. Non-theme Utility Export Example

```tsx
import { sayHello, type sayHelloProps } from 'company-theme';

const user: sayHelloProps = { firstName: 'Alex', lastName: 'Taylor' };
const greeting = sayHello(user); // Hello, Alex Taylor!
```

## 10. Troubleshooting

- Hook error: "useTheme must be used within a ThemeProvider"
  - Make sure component is wrapped by `ThemeProvider` in `src/app/providers/app-providers.tsx`.
- Theme not changing visually
  - Confirm `company-theme/styles.css` is imported in `src/app/layout.tsx`.
  - Confirm you are using `var(--app-...)` tokens in components/styles.
- Server component issue
  - `useTheme` only works in client components (`'use client'`).

## 11. Tailwind Configuration (After Adding company-theme Colors)

If your project uses Tailwind, map semantic color keys to `--app-*` tokens.

Path: `tailwind.config.ts`

```ts
const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'var(--app-bg)',
        foreground: 'var(--app-text)',
        border: 'var(--app-border)',
        input: 'var(--app-border)',
        ring: 'var(--app-primary)',
        primary: {
          DEFAULT: 'var(--app-primary)',
          foreground: 'var(--app-primary-contrast)',
        },
        secondary: {
          DEFAULT: 'var(--app-surface-2)',
          foreground: 'var(--app-text)',
        },
        destructive: {
          DEFAULT: 'var(--app-error)',
          foreground: 'var(--app-primary-contrast)',
        },
        muted: {
          DEFAULT: 'var(--app-surface-2)',
          foreground: 'var(--app-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--app-accent)',
          foreground: 'var(--app-primary-contrast)',
        },
        card: {
          DEFAULT: 'var(--app-surface)',
          foreground: 'var(--app-text)',
        },
        sidebar: {
          DEFAULT: 'var(--app-surface)',
          foreground: 'var(--app-text)',
          primary: 'var(--app-primary)',
          'primary-foreground': 'var(--app-primary-contrast)',
          accent: 'var(--app-surface-2)',
          'accent-foreground': 'var(--app-text)',
          border: 'var(--app-border)',
          ring: 'var(--app-primary)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
      },
    },
  },
  plugins: [],
};

export default config;
```
