'use client';

import { ApolloProvider } from '@apollo/client';
import { useMemo, type ReactNode } from 'react';
import { createApolloClient } from '../lib/apollo-client';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const client = useMemo(() => createApolloClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
