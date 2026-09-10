'use client';

import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_ALL_BRANCHES } from '@/app/graphql/admin/branches/branchOperations';
import { GET_ALL_USERS } from '@/app/graphql/admin/users/userOperations';
import { GET_ALL_VENDORS } from '@/app/graphql/admin/vendors/vendorOperations';
import { GET_ALL_LEAVES } from '@/app/graphql/admin/leaves/leaveOperations';

export type AdminLeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

type LeaveRow = {
  id: string;
  userId: string;
  managerId: string | null;
  leaveTypeCode: string;
  leaveTypeDescription: string;
  reason: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  status: AdminLeaveStatus;
  comments: string | null;
  createdAt: string;
  updatedAt: string;
};

type AllLeavesQueryData = {
  getAllLeaves: {
    results: LeaveRow[];
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

type UseAdminLeaveDataOptions = {
  status?: AdminLeaveStatus;
  offset?: number;
  limit?: number;
  search?: string;
  includeBranches?: boolean;
  includeVendors?: boolean;
};

export function useAdminLeaveData(options?: UseAdminLeaveDataOptions) {
  const status = options?.status;
  const offset = options?.offset ?? 0;
  const limit = options?.limit ?? 50;
  const search = options?.search?.trim() || undefined;
  const includeBranches = options?.includeBranches ?? true;
  const includeVendors = options?.includeVendors ?? true;

  const leavesQuery = useQuery<AllLeavesQueryData>(GET_ALL_LEAVES, {
    variables: { offset, limit, status, search },
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

  const leaves = useMemo(() => leavesQuery.data?.getAllLeaves.results ?? [], [leavesQuery.data]);
  const totalCount = leavesQuery.data?.getAllLeaves.totalCount;
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
    leavesQuery.loading ||
    usersQuery.loading ||
    (includeBranches && branchesQuery.loading) ||
    (includeVendors && vendorsQuery.loading);

  const error =
    leavesQuery.error ||
    usersQuery.error ||
    (includeBranches ? branchesQuery.error : undefined) ||
    (includeVendors ? vendorsQuery.error : undefined);

  async function refetchAll() {
    const refetchTasks: Array<Promise<unknown>> = [leavesQuery.refetch(), usersQuery.refetch()];

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
