import { cacheExchange, createClient, fetchExchange } from 'urql';

export const urqlClient = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:5000/graphql',
  exchanges: [cacheExchange, fetchExchange],
});
