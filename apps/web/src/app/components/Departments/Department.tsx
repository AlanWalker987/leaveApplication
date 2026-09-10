'use client';

import { GET_ALL_DEPARTMENT_DETAILS } from '@/app/graphql/admin/departments/departmentOperations';
import { DELETE_DEPARTMENT_BY_ID } from '@/app/graphql/admin/departments/departmentOperations';
import { GET_ALL_BRANCHES } from '@/app/graphql/admin/branches/branchOperations';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  GetAllBranchesAdminQuery,
  GetAllBranchesAdminQueryVariables,
  GetAllUsersQuery,
  GetAllUsersQueryVariables,
  GetDepartmentsQuery,
  GetDepartmentsQueryVariables,
  Mutation,
  MutationDeleteDepartmentByIdArgs,
  Role,
} from '@/gql/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { Pencil, ShieldCheck, Trash2, UserRound } from 'lucide-react';
import { GET_ALL_USERS } from '@/app/graphql/admin/users/userOperations';
import { useMemo, useState } from 'react';
import { CreateDepartmentSheet } from './sheets/create-department-sheet';
import { EditDepartmentSheet } from './sheets/edit-department-sheet';
import { MessagePopup } from '@/components/dialogs/message-popup';
import { ConfirmActionDialog } from '@/components/dialogs/confirm-action-dialog';

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

export default function Department() {
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Pick<
    GetDepartmentsQuery['getDepartments']['results'][number],
    'id' | 'name'
  > | null>(null);
  const [statusPopup, setStatusPopup] = useState<{
    tone: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);
  const [deleteDepartmentById, { loading: deletingDepartment }] = useMutation<
    Pick<Mutation, 'deleteDepartmentById'>,
    MutationDeleteDepartmentByIdArgs
  >(DELETE_DEPARTMENT_BY_ID);

  const paginationVariables = useMemo(() => ({ offset: 0, limit: 1000 }), []);

  const { data, loading, error, refetch } = useQuery<
    GetDepartmentsQuery,
    GetDepartmentsQueryVariables
  >(GET_ALL_DEPARTMENT_DETAILS, {
    variables: paginationVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    returnPartialData: true,
  });

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GET_ALL_USERS, {
    variables: paginationVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    returnPartialData: true,
  });

  const {
    data: branchesData,
    loading: branchesLoading,
    error: branchesError,
  } = useQuery<GetAllBranchesAdminQuery, GetAllBranchesAdminQueryVariables>(GET_ALL_BRANCHES, {
    variables: paginationVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    returnPartialData: true,
  });

  const departments = useMemo(
    () => data?.getDepartments.results.filter((department) => !department.isDeleted) ?? [],
    [data],
  );
  const selectedDepartment = departments.find(
    (department) => department.id === selectedDepartmentId,
  );

  const managerOptions = useMemo(
    () =>
      (usersData?.getAllUsers.results ?? [])
        .filter((user) => user.userRole === Role.Manager)
        .map((user) => ({ id: user.id, label: `${user.firstName} ${user.lastName}` })),
    [usersData],
  );

  const employeeOptions = useMemo(
    () =>
      (usersData?.getAllUsers.results ?? [])
        .filter((user) => !user.isDeleted && user.userRole === Role.Employee)
        .map((user) => ({ id: user.id, label: `${user.firstName} ${user.lastName}` })),
    [usersData],
  );

  const assignedEmployeeIds = useMemo(() => {
    const ids = new Set<string>();

    for (const department of departments) {
      for (const employee of department.employees) {
        ids.add(employee.id);
      }
    }

    return ids;
  }, [departments]);

  const selectedDepartmentEmployeeIds = useMemo(
    () => new Set(selectedDepartment?.employees.map((employee) => employee.id) ?? []),
    [selectedDepartment],
  );

  const createEmployeeOptions = useMemo(
    () => employeeOptions.filter((employee) => !assignedEmployeeIds.has(employee.id)),
    [employeeOptions, assignedEmployeeIds],
  );

  const editEmployeeOptions = useMemo(
    () =>
      employeeOptions.filter(
        (employee) =>
          !assignedEmployeeIds.has(employee.id) || selectedDepartmentEmployeeIds.has(employee.id),
      ),
    [employeeOptions, assignedEmployeeIds, selectedDepartmentEmployeeIds],
  );

  const branchOptions = useMemo(
    () =>
      (branchesData?.getBranches.results ?? [])
        .filter((branch) => !branch.isDeleted)
        .map((branch) => ({
          id: branch.id,
          label: `${branch.name} (${branch.code})`,
          location: branch.location,
        })),
    [branchesData],
  );

  const branchLabelByLocation = useMemo(
    () =>
      new Map(branchOptions.map((branch) => [branch.location.trim().toLowerCase(), branch.label])),
    [branchOptions],
  );

  async function handleMutationSuccess() {
    await refetch();
  }

  async function handleDeleteConfirm() {
    if (!departmentToDelete?.id) {
      setStatusPopup({
        tone: 'warning',
        title: 'Delete Department',
        message: 'Unable to delete department because department id is missing.',
      });
      return;
    }

    const departmentName = departmentToDelete.name;

    try {
      await deleteDepartmentById({
        variables: {
          id: departmentToDelete.id,
        },
      });
      setDepartmentToDelete(null);
      await refetch();
      setStatusPopup({
        tone: 'success',
        title: 'Department Deleted',
        message: `${departmentName} was deleted successfully.`,
      });
    } catch (error) {
      setStatusPopup({
        tone: 'error',
        title: 'Delete Failed',
        message: error instanceof Error ? error.message : 'Failed to delete department.',
      });
    }
  }

  if (loading || usersLoading || branchesLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center rounded-2xl bg-[var(--app-surface)]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-[var(--app-error)]">Error: {error.message}</p>;
  }

  if (usersError) {
    return <p className="text-sm text-[var(--app-error)]">Error: {usersError.message}</p>;
  }

  if (branchesError) {
    return <p className="text-sm text-[var(--app-error)]">Error: {branchesError.message}</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Departments</h1>
          <p className="text-sm text-[var(--app-text-muted)]">Manage and view all departments in the system.</p>
        </div>
        <Button className="text-md font-bold" onClick={() => setIsCreateSheetOpen(true)}>
          + Add Department
        </Button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {departments.map((department) => (
          <Card
            key={department.id}
            className="overflow-hidden border-[var(--app-border)] bg-[var(--app-surface)] py-0 shadow-none"
          >
            <div className="flex items-start justify-between gap-4 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--app-primary)] text-xs font-bold text-[var(--app-white)]">
                  {department.name.slice(0, 3).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-[var(--app-text)]">
                    {department.name}
                  </h2>
                  <p className="truncate text-sm text-[var(--app-text-muted)]">{department.subtitle}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-[var(--app-text-muted)]">
                <button
                  type="button"
                  aria-label={`Edit ${department.name}`}
                  title="Edit department"
                  onClick={() => setSelectedDepartmentId(department.id)}
                  className="rounded-md p-1.5 hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${department.name}`}
                  title="Delete department"
                  onClick={() => {
                    setStatusPopup(null);
                    setDepartmentToDelete({ id: department.id, name: department.name });
                  }}
                  className="rounded-md p-1.5 text-[var(--app-error)] hover:bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] hover:text-[var(--app-error)]"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 border-y border-[var(--app-border)] px-5 py-3 text-sm text-[var(--app-text-muted)]">
              <ShieldCheck className="size-4 text-[var(--app-primary)]" />
              <span>Manager:</span>
              <span className="flex items-center gap-2 font-semibold text-[var(--app-text)]">
                <span className="flex size-8 items-center justify-center rounded-full bg-[var(--app-electric-blue-3)] text-xs text-[var(--app-white)]">
                  {getInitials(department.manager.firstName, department.manager.lastName)}
                </span>
                {department.manager.firstName} {department.manager.lastName}
              </span>
              <span className="text-[var(--app-text-muted)]">&middot;</span>
              <span>
                {branchLabelByLocation.get(department.location.trim().toLowerCase()) ??
                  department.location}
              </span>
            </div>

            <CardContent className="space-y-2 px-5 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[var(--app-text-muted)]">
                  <UserRound className="size-4" />
                  {department.employees.length}{' '}
                  {department.employees.length === 1 ? 'Employee' : 'Employees'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {department.employees.map((employee) => (
                  <span
                    key={employee.id}
                    className="flex items-center gap-2 rounded-lg bg-[var(--app-surface-2)] px-2 py-1 text-sm text-[var(--app-text)]"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-[var(--app-gray-600)] text-xs font-semibold text-[var(--app-white)]">
                      {getInitials(employee.firstName, employee.lastName)}
                    </span>
                    {employee.firstName}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateDepartmentSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        branchOptions={branchOptions}
        managerOptions={managerOptions}
        employeeOptions={createEmployeeOptions}
        onSuccess={handleMutationSuccess}
      />

      <EditDepartmentSheet
        open={Boolean(selectedDepartmentId)}
        department={selectedDepartment}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDepartmentId(null);
          }
        }}
        branchOptions={branchOptions}
        managerOptions={managerOptions}
        employeeOptions={editEmployeeOptions}
        onSuccess={handleMutationSuccess}
      />

      <ConfirmActionDialog
        open={Boolean(departmentToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setDepartmentToDelete(null);
          }
        }}
        title="Delete Department"
        description={`Are you sure you want to delete the department ${departmentToDelete?.name}? `}
        onConfirm={handleDeleteConfirm}
        confirmLabel="Delete"
        isConfirming={deletingDepartment}
        pendingLabel="Deleting..."
      />

      {statusPopup ? (
        <MessagePopup
          open
          tone={statusPopup.tone}
          title={statusPopup.title}
          message={statusPopup.message}
          onClose={() => setStatusPopup(null)}
        />
      ) : null}
    </>
  );
}
