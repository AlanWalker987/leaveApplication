'use client';

import { useQuery } from '@apollo/client';
import { GET_ME } from '../features/auth/graphql/operations';
import { hasAccessToken } from '../features/auth/utils/session';

type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: 'Admin' | 'Manager' | 'Employee';
  designation: string;
  branchId: string | null;
  vendorId: string | null;
};

type GetMeQueryData = {
  me: CurrentUser | null;
};

type UseCurrentUserOptions = {
  skip?: boolean;
};

export function useCurrentUser(options?: UseCurrentUserOptions) {
  const authenticated = hasAccessToken();
  const shouldSkip = Boolean(options?.skip) || !authenticated;

  const query = useQuery<GetMeQueryData>(GET_ME, {
    skip: shouldSkip,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  return {
    ...query,
    user: query.data?.me ?? null,
    userFullName: query.data?.me ? `${query.data.me.firstName} ${query.data.me.lastName}` : null,
    isAuthenticated: authenticated,
  };
}
