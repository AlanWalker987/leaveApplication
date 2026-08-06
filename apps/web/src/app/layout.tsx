import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import 'react-day-picker/style.css';
import './globals.css';
import '../styles/main.scss';
import { AppProviders } from './providers/app-providers';

export const metadata: Metadata = {
  title: 'Leave Management System',
  description: 'Monorepo scaffold for Leave Management System',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
