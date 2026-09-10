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
