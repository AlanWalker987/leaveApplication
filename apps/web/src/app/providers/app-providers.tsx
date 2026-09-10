'use client';

import { ApolloProvider } from '@apollo/client';
import { useMemo, type ReactNode } from 'react';
import { createApolloClient } from '../lib/apollo-client';
import { ThemeProvider } from 'company-theme';
import { TourProvider } from 'company-user-tour';
import { ManagerDashboardTour } from '@/tours/ManagerDashboard';
import { EmployeeDashboardTour } from '@/tours/EmployeeDashboard';
import { AdminDashboardTour } from '@/tours/AdminDashboard';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const client = useMemo(() => createApolloClient(), []);

  return (
    <ThemeProvider defaultTheme="system">
      <TourProvider tours={[ManagerDashboardTour, EmployeeDashboardTour, AdminDashboardTour]}>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </TourProvider>
    </ThemeProvider>
  );
}
