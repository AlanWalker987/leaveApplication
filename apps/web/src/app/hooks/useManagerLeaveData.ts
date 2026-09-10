'use client';

import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_ALL_USERS } from '@/app/graphql/admin/users/userOperations';
import { GET_ALL_BRANCHES } from '@/app/graphql/admin/branches/branchOperations';
import { GET_ALL_VENDORS } from '@/app/graphql/admin/vendors/vendorOperations';
import { GET_TEAM_LEAVES } from '@/app/graphql/manager/managerOperations';

export type ManagerLeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

type TeamLeaveRow = {
  id: string;
  userId: string;
  managerId: string | null;
  leaveTypeCode: string;
  leaveTypeDescription: string;
  reason: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  status: ManagerLeaveStatus;
  comments: string | null;
  createdAt: string;
  updatedAt: string;
};

type TeamLeavesQueryData = {
  getTeamLeaves: {
    results: TeamLeaveRow[];
    totalCount: number;
  };
};

type UserRow = {
  id: string;
  firstName: string;
  lastName: string;
  managerId: string | null;
  branchId: string | null;
  vendorId: string | null;
};

type UsersQueryData = {
  getAllUsers: {
    results: UserRow[];
  };
};

type BranchRow = {
  id: string;
  name: string;
};

type BranchesQueryData = {
  getBranches: {
    results: BranchRow[];
  };
};

type VendorRow = {
  id: string;
  name: string;
};

type VendorsQueryData = {
  getVendors: {
    results: VendorRow[];
  };
};

type UseManagerLeaveDataOptions = {
  status?: ManagerLeaveStatus;
  offset?: number;
  limit?: number;
  includeBranches?: boolean;
  includeVendors?: boolean;
};

export function useManagerLeaveData(options?: UseManagerLeaveDataOptions) {
  const status = options?.status;
  const offset = options?.offset ?? 0;
  const limit = options?.limit ?? 50;
  const includeBranches = options?.includeBranches ?? true;
  const includeVendors = options?.includeVendors ?? true;

  const teamLeavesQuery = useQuery<TeamLeavesQueryData>(GET_TEAM_LEAVES, {
    variables: { offset, limit, status },
    fetchPolicy: 'cache-and-network',
  });

  const usersQuery = useQuery<UsersQueryData>(GET_ALL_USERS, {
    variables: { offset: 0, limit: 1000 },
    fetchPolicy: 'cache-and-network',
  });

  const branchesQuery = useQuery<BranchesQueryData>(GET_ALL_BRANCHES, {
    skip: !includeBranches,
    variables: { offset: 0, limit: 500 },
    fetchPolicy: 'cache-and-network',
  });

  const vendorsQuery = useQuery<VendorsQueryData>(GET_ALL_VENDORS, {
    skip: !includeVendors,
    variables: { offset: 0, limit: 500 },
    fetchPolicy: 'cache-and-network',
  });

  const leaves = useMemo(
    () => teamLeavesQuery.data?.getTeamLeaves.results ?? [],
    [teamLeavesQuery.data],
  );
  const totalCount = teamLeavesQuery.data?.getTeamLeaves.totalCount;
  const users = useMemo(() => usersQuery.data?.getAllUsers.results ?? [], [usersQuery.data]);
  const branches = useMemo(
    () => branchesQuery.data?.getBranches.results ?? [],
    [branchesQuery.data],
  );
  const vendors = useMemo(() => vendorsQuery.data?.getVendors.results ?? [], [vendorsQuery.data]);

  const usersById = useMemo(() => new Map(users.map((row) => [row.id, row])), [users]);
  const branchesById = useMemo(() => new Map(branches.map((row) => [row.id, row])), [branches]);
  const vendorsById = useMemo(() => new Map(vendors.map((row) => [row.id, row])), [vendors]);

  const loading =
    teamLeavesQuery.loading ||
    usersQuery.loading ||
    (includeBranches && branchesQuery.loading) ||
    (includeVendors && vendorsQuery.loading);

  const error =
    teamLeavesQuery.error ||
    usersQuery.error ||
    (includeBranches ? branchesQuery.error : undefined) ||
    (includeVendors ? vendorsQuery.error : undefined);

  async function refetchAll() {
    const refetchTasks: Array<Promise<unknown>> = [teamLeavesQuery.refetch(), usersQuery.refetch()];

    if (includeBranches) {
      refetchTasks.push(branchesQuery.refetch());
    }

    if (includeVendors) {
      refetchTasks.push(vendorsQuery.refetch());
    }

    await Promise.all(refetchTasks);
  }

  return {
    leaves,
    totalCount,
    usersById,
    branchesById,
    vendorsById,
    loading,
    error,
    refetchAll,
  };
}
