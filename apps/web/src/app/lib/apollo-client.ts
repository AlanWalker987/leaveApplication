import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const graphqlUri = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:5000/graphql';

const httpLink = new HttpLink({
  uri: graphqlUri,
});

const authLink = setContext((_, { headers }) => {
  if (typeof window === 'undefined') {
    return { headers };
  }

  // Allow specific public operations to bypass auth header injection.
  if (headers?.['x-skip-auth']) {
    return {
      headers: {
        ...headers,
      },
    };
  }

  const token = window.localStorage.getItem('lms_access_token');

  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

export function createApolloClient() {
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
