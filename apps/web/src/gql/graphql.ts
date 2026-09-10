/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AuthTokens = {
  __typename?: 'AuthTokens';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['Int']['output'];
  refreshToken: Scalars['String']['output'];
  tokenType: Scalars['String']['output'];
};

/** Branch model */
export type Branch = {
  __typename?: 'Branch';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Response structure for paginated list of branhces */
export type BranchListResponse = {
  __typename?: 'BranchListResponse';
  results: Array<Branch>;
  totalCount: Scalars['Int']['output'];
};

/** CreateBranchInput */
export type CreateBranchInput = {
  code: Scalars['String']['input'];
  location: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateDepartmentInput = {
  employeeIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  location: Scalars['String']['input'];
  managerId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  subtitle: Scalars['String']['input'];
};

export type CreateLeaveTypeInput = {
  code: Scalars['String']['input'];
  description: Scalars['String']['input'];
};

export type CreatePublicHolidayInput = {
  holidayDate: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
};

export type CreateVendorInput = {
  contactEmail: Scalars['String']['input'];
  contactName: Scalars['String']['input'];
  contactNumber: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type Department = {
  __typename?: 'Department';
  createdAt: Scalars['DateTime']['output'];
  employees: Array<User>;
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  manager: User;
  managerId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  subtitle: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type DepartmentListResponse = {
  __typename?: 'DepartmentListResponse';
  results: Array<Department>;
  totalCount: Scalars['Int']['output'];
};

export enum Gender {
  Female = 'Female',
  Male = 'Male'
}

export type LeaveType = {
  __typename?: 'LeaveType';
  code: Scalars['String']['output'];
  createAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LeaveTypeListResponse = {
  __typename?: 'LeaveTypeListResponse';
  results: Array<LeaveType>;
  totalCount: Scalars['Int']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** Define the mutations that can be made to the Branch model */
export type Mutation = {
  __typename?: 'Mutation';
  createBranch?: Maybe<Branch>;
  createDepartment?: Maybe<Department>;
  createLeaveType?: Maybe<LeaveType>;
  createPublicHoliday?: Maybe<PublicHoliday>;
  createVendor?: Maybe<Vendor>;
  deleteBranchById?: Maybe<Branch>;
  deleteDepartmentById?: Maybe<Department>;
  deleteLeaveTypeById?: Maybe<LeaveType>;
  deletePublicHolidayById?: Maybe<PublicHoliday>;
  deleteVendorById?: Maybe<Vendor>;
  login: AuthTokens;
  logoutAllTabs: Scalars['Boolean']['output'];
  refreshToken: AuthTokens;
  register: User;
  updateBranchById?: Maybe<Branch>;
  updateDepartmentById?: Maybe<Department>;
  updateLeaveTypeById?: Maybe<LeaveType>;
  updatePublicHolidayById?: Maybe<PublicHoliday>;
  updateVendorById?: Maybe<Vendor>;
};


/** Define the mutations that can be made to the Branch model */
export type MutationCreateBranchArgs = {
  input: CreateBranchInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationCreateDepartmentArgs = {
  input: CreateDepartmentInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationCreateLeaveTypeArgs = {
  input: CreateLeaveTypeInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationCreatePublicHolidayArgs = {
  input: CreatePublicHolidayInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationCreateVendorArgs = {
  input: CreateVendorInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationDeleteBranchByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Define the mutations that can be made to the Branch model */
export type MutationDeleteDepartmentByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Define the mutations that can be made to the Branch model */
export type MutationDeleteLeaveTypeByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Define the mutations that can be made to the Branch model */
export type MutationDeletePublicHolidayByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Define the mutations that can be made to the Branch model */
export type MutationDeleteVendorByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Define the mutations that can be made to the Branch model */
export type MutationLoginArgs = {
  input: LoginInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationRegisterArgs = {
  input: RegisterInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationUpdateBranchByIdArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBranchInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationUpdateDepartmentByIdArgs = {
  id: Scalars['ID']['input'];
  input: UpdateDepartmentInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationUpdateLeaveTypeByIdArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLeaveTypeInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationUpdatePublicHolidayByIdArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePublicHolidayInput;
};


/** Define the mutations that can be made to the Branch model */
export type MutationUpdateVendorByIdArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorInput;
};

export type PublicHoliday = {
  __typename?: 'PublicHoliday';
  createdAt: Scalars['DateTime']['output'];
  holidayDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PublicHolidayListResponse = {
  __typename?: 'PublicHolidayListResponse';
  results: Array<PublicHoliday>;
  totalCount: Scalars['Int']['output'];
};

/** Define the queries that can be made to the Branch model */
export type Query = {
  __typename?: 'Query';
  getAllUsers: UserListResponse;
  getBranchById?: Maybe<Branch>;
  getBranches: BranchListResponse;
  getDepartmentById?: Maybe<Department>;
  getDepartments: DepartmentListResponse;
  getLeaveTypeById?: Maybe<LeaveType>;
  getLeaveTypes: LeaveTypeListResponse;
  getPublicHolidayById?: Maybe<PublicHoliday>;
  getPublicHolidays: PublicHolidayListResponse;
  getVendorById?: Maybe<Vendor>;
  getVendors: VendorListResponse;
  health: Scalars['String']['output'];
  me?: Maybe<User>;
};


/** Define the queries that can be made to the Branch model */
export type QueryGetAllUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Define the queries that can be made to the Branch model */
export type QueryGetBranchByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Define the queries that can be made to the Branch model */
export type QueryGetBranchesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


/** Define the queries that can be made to the Branch model */
export type QueryGetDepartmentByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Define the queries that can be made to the Branch model */
export type QueryGetDepartmentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Define the queries that can be made to the Branch model */
export type QueryGetLeaveTypeByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Define the queries that can be made to the Branch model */
export type QueryGetLeaveTypesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Define the queries that can be made to the Branch model */
export type QueryGetPublicHolidayByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Define the queries that can be made to the Branch model */
export type QueryGetPublicHolidaysArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Define the queries that can be made to the Branch model */
export type QueryGetVendorByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Define the queries that can be made to the Branch model */
export type QueryGetVendorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type RefreshTokenInput = {
  refreshToken: Scalars['String']['input'];
};

export type RegisterInput = {
  branchId?: InputMaybe<Scalars['ID']['input']>;
  dateOfBirth: Scalars['DateTime']['input'];
  dateOfJoining: Scalars['DateTime']['input'];
  designation: Scalars['String']['input'];
  email: Scalars['String']['input'];
  emergencyContactName: Scalars['String']['input'];
  emergencyContactNumber: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  gender?: InputMaybe<Gender>;
  lastName: Scalars['String']['input'];
  managerId?: InputMaybe<Scalars['ID']['input']>;
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  userRole: Role;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};

export enum Role {
  Admin = 'Admin',
  Employee = 'Employee',
  Manager = 'Manager'
}

/** UpdateBranchInput */
export type UpdateBranchInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDepartmentInput = {
  employeeIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  location?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLeaveTypeInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePublicHolidayInput = {
  holidayDate?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorInput = {
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactName?: InputMaybe<Scalars['String']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  branchId?: Maybe<Scalars['ID']['output']>;
  createAt: Scalars['DateTime']['output'];
  dateOfBirth: Scalars['DateTime']['output'];
  dateOfJoining: Scalars['DateTime']['output'];
  designation: Scalars['String']['output'];
  email: Scalars['String']['output'];
  emergencyContactName: Scalars['String']['output'];
  emergencyContactNumber: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender?: Maybe<Gender>;
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  managerId?: Maybe<Scalars['ID']['output']>;
  phoneNumber: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userRole: Role;
  vendorId?: Maybe<Scalars['ID']['output']>;
};

export type UserListResponse = {
  __typename?: 'UserListResponse';
  results: Array<User>;
  totalCount: Scalars['Int']['output'];
};

export type Vendor = {
  __typename?: 'Vendor';
  contactEmail: Scalars['String']['output'];
  contactName: Scalars['String']['output'];
  contactNumber: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type VendorListResponse = {
  __typename?: 'VendorListResponse';
  results: Array<Vendor>;
  totalCount: Scalars['Int']['output'];
};

export type GetBranchesQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetBranchesQuery = { __typename?: 'Query', getBranches: { __typename?: 'BranchListResponse', results: Array<{ __typename?: 'Branch', id: string, name: string, code: string }> } };

export type GetVendorsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetVendorsQuery = { __typename?: 'Query', getVendors: { __typename?: 'VendorListResponse', results: Array<{ __typename?: 'Vendor', id: string, name: string }> } };

export type RegisterUserMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', register: { __typename?: 'User', id: string, email: string } };

export type LoginUserMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginUserMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthTokens', accessToken: string, refreshToken: string, tokenType: string, expiresIn: number } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, userRole: Role, designation: string, branchId?: string | null, vendorId?: string | null, gender?: Gender | null } | null };

export type GetAllBranchesAdminQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllBranchesAdminQuery = { __typename?: 'Query', getBranches: { __typename?: 'BranchListResponse', results: Array<{ __typename?: 'Branch', id: string, name: string, code: string, location: string, createdAt: any, isDeleted: boolean, updatedAt: any }> } };

export type CreateBranchMutationVariables = Exact<{
  input: CreateBranchInput;
}>;


export type CreateBranchMutation = { __typename?: 'Mutation', createBranch?: { __typename?: 'Branch', id: string, name: string, code: string, location: string, createdAt: any, isDeleted: boolean, updatedAt: any } | null };

export type UpdateBranchByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateBranchInput;
}>;


export type UpdateBranchByIdMutation = { __typename?: 'Mutation', updateBranchById?: { __typename?: 'Branch', id: string, name: string, code: string, location: string, createdAt: any, isDeleted: boolean, updatedAt: any } | null };

export type DeleteBranchByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteBranchByIdMutation = { __typename?: 'Mutation', deleteBranchById?: { __typename?: 'Branch', id: string, name: string, code: string, location: string, createdAt: any, isDeleted: boolean, updatedAt: any } | null };

export type GetDepartmentsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDepartmentsQuery = { __typename?: 'Query', getDepartments: { __typename?: 'DepartmentListResponse', results: Array<{ __typename?: 'Department', id: string, name: string, subtitle: string, location: string, managerId: string, createdAt: any, isDeleted: boolean, updatedAt: any, manager: { __typename?: 'User', id: string, firstName: string, lastName: string }, employees: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }> }> } };

export type CreateDepartmentMutationVariables = Exact<{
  input: CreateDepartmentInput;
}>;


export type CreateDepartmentMutation = { __typename?: 'Mutation', createDepartment?: { __typename?: 'Department', id: string, name: string, subtitle: string, location: string, managerId: string, createdAt: any, isDeleted: boolean, updatedAt: any, manager: { __typename?: 'User', id: string, firstName: string, lastName: string }, employees: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }> } | null };

export type UpdateDepartmentByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateDepartmentInput;
}>;


export type UpdateDepartmentByIdMutation = { __typename?: 'Mutation', updateDepartmentById?: { __typename?: 'Department', id: string, name: string, subtitle: string, location: string, managerId: string, createdAt: any, isDeleted: boolean, updatedAt: any, manager: { __typename?: 'User', id: string, firstName: string, lastName: string }, employees: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }> } | null };

export type GetAllLeaveTypesQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllLeaveTypesQuery = { __typename?: 'Query', getLeaveTypes: { __typename?: 'LeaveTypeListResponse', results: Array<{ __typename?: 'LeaveType', id: string, code: string, description: string, createAt: any, updatedAt: any, isDeleted: boolean }> } };

export type CreateLeaveTypeMutationVariables = Exact<{
  input: CreateLeaveTypeInput;
}>;


export type CreateLeaveTypeMutation = { __typename?: 'Mutation', createLeaveType?: { __typename?: 'LeaveType', id: string, code: string, description: string, createAt: any, isDeleted: boolean, updatedAt: any } | null };

export type UpdateLeaveTypeByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateLeaveTypeInput;
}>;


export type UpdateLeaveTypeByIdMutation = { __typename?: 'Mutation', updateLeaveTypeById?: { __typename?: 'LeaveType', id: string, code: string, description: string, createAt: any, isDeleted: boolean, updatedAt: any } | null };

export type DeleteLeaveTypeByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLeaveTypeByIdMutation = { __typename?: 'Mutation', deleteLeaveTypeById?: { __typename?: 'LeaveType', id: string, code: string, description: string, createAt: any, isDeleted: boolean, updatedAt: any } | null };

export type GetAllPublicHolidaysQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllPublicHolidaysQuery = { __typename?: 'Query', getPublicHolidays: { __typename?: 'PublicHolidayListResponse', results: Array<{ __typename?: 'PublicHoliday', id: string, holidayDate: any, title: string, createdAt: any, updatedAt: any, isDeleted: boolean }> } };

export type CreatePublicHolidayMutationVariables = Exact<{
  input: CreatePublicHolidayInput;
}>;


export type CreatePublicHolidayMutation = { __typename?: 'Mutation', createPublicHoliday?: { __typename?: 'PublicHoliday', id: string, holidayDate: any, title: string, createdAt: any, updatedAt: any, isDeleted: boolean } | null };

export type UpdatePublicHolidayByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdatePublicHolidayInput;
}>;


export type UpdatePublicHolidayByIdMutation = { __typename?: 'Mutation', updatePublicHolidayById?: { __typename?: 'PublicHoliday', id: string, holidayDate: any, title: string, createdAt: any, updatedAt: any, isDeleted: boolean } | null };

export type DeletePublicHolidayByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePublicHolidayByIdMutation = { __typename?: 'Mutation', deletePublicHolidayById?: { __typename?: 'PublicHoliday', id: string, holidayDate: any, title: string, createdAt: any, updatedAt: any, isDeleted: boolean } | null };

export type GetAllUsersQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: { __typename?: 'UserListResponse', results: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber: string, designation: string, userRole: Role, dateOfJoining: any, dateOfBirth: any, emergencyContactName: string, emergencyContactNumber: string, branchId?: string | null, managerId?: string | null, vendorId?: string | null, createAt: any, isDeleted: boolean, updatedAt: any, gender?: Gender | null }> } };

export type CreateUserMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', register: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, userRole: Role, phoneNumber: string, designation: string, dateOfBirth: any, dateOfJoining: any, emergencyContactName: string, emergencyContactNumber: string, branchId?: string | null, managerId?: string | null, vendorId?: string | null, createAt: any, updatedAt: any, isDeleted: boolean, gender?: Gender | null } };

export type GetAllVendorsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllVendorsQuery = { __typename?: 'Query', getVendors: { __typename?: 'VendorListResponse', results: Array<{ __typename?: 'Vendor', id: string, name: string, contactName: string, contactEmail: string, contactNumber: string, createdAt: any, isDeleted: boolean, updatedAt: any }> } };

export type CreateVendorMutationVariables = Exact<{
  input: CreateVendorInput;
}>;


export type CreateVendorMutation = { __typename?: 'Mutation', createVendor?: { __typename?: 'Vendor', id: string, name: string, contactName: string, contactEmail: string, contactNumber: string, createdAt: any, updatedAt: any, isDeleted: boolean } | null };

export type UpdateVendorByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateVendorInput;
}>;


export type UpdateVendorByIdMutation = { __typename?: 'Mutation', updateVendorById?: { __typename?: 'Vendor', id: string, name: string, contactName: string, contactEmail: string, contactNumber: string, createdAt: any, updatedAt: any, isDeleted: boolean } | null };

export type DeleteVendorByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteVendorByIdMutation = { __typename?: 'Mutation', deleteVendorById?: { __typename?: 'Vendor', id: string, name: string, contactName: string, contactEmail: string, contactNumber: string, createdAt: any, updatedAt: any, isDeleted: boolean } | null };

export type GetPublicHolidaysQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPublicHolidaysQuery = { __typename?: 'Query', getPublicHolidays: { __typename?: 'PublicHolidayListResponse', results: Array<{ __typename?: 'PublicHoliday', id: string, title: string, holidayDate: any, createdAt: any, isDeleted: boolean, updatedAt: any }> } };


export const GetBranchesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBranches"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBranches"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetBranchesQuery, GetBranchesQueryVariables>;
export const GetVendorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVendors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVendors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetVendorsQuery, GetVendorsQueryVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const LoginUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"tokenType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}}]}}]}}]} as unknown as DocumentNode<LoginUserMutation, LoginUserMutationVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"designation"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"vendorId"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetAllBranchesAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllBranchesAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBranches"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllBranchesAdminQuery, GetAllBranchesAdminQueryVariables>;
export const CreateBranchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBranch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBranchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBranch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateBranchMutation, CreateBranchMutationVariables>;
export const UpdateBranchByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBranchById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBranchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBranchById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateBranchByIdMutation, UpdateBranchByIdMutationVariables>;
export const DeleteBranchByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBranchById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBranchById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<DeleteBranchByIdMutation, DeleteBranchByIdMutationVariables>;
export const GetDepartmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getDepartments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDepartments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"managerId"}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"employees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetDepartmentsQuery, GetDepartmentsQueryVariables>;
export const CreateDepartmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDepartment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDepartmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDepartment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"managerId"}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"employees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateDepartmentMutation, CreateDepartmentMutationVariables>;
export const UpdateDepartmentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDepartmentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDepartmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDepartmentById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"managerId"}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"employees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateDepartmentByIdMutation, UpdateDepartmentByIdMutationVariables>;
export const GetAllLeaveTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllLeaveTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLeaveTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllLeaveTypesQuery, GetAllLeaveTypesQueryVariables>;
export const CreateLeaveTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLeaveType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLeaveTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLeaveType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateLeaveTypeMutation, CreateLeaveTypeMutationVariables>;
export const UpdateLeaveTypeByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLeaveTypeById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLeaveTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLeaveTypeById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateLeaveTypeByIdMutation, UpdateLeaveTypeByIdMutationVariables>;
export const DeleteLeaveTypeByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLeaveTypeById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLeaveTypeById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<DeleteLeaveTypeByIdMutation, DeleteLeaveTypeByIdMutationVariables>;
export const GetAllPublicHolidaysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllPublicHolidays"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPublicHolidays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"holidayDate"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllPublicHolidaysQuery, GetAllPublicHolidaysQueryVariables>;
export const CreatePublicHolidayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePublicHoliday"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePublicHolidayInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPublicHoliday"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"holidayDate"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]}}]} as unknown as DocumentNode<CreatePublicHolidayMutation, CreatePublicHolidayMutationVariables>;
export const UpdatePublicHolidayByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePublicHolidayById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePublicHolidayInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePublicHolidayById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"holidayDate"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]}}]} as unknown as DocumentNode<UpdatePublicHolidayByIdMutation, UpdatePublicHolidayByIdMutationVariables>;
export const DeletePublicHolidayByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePublicHolidayById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePublicHolidayById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"holidayDate"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]}}]} as unknown as DocumentNode<DeletePublicHolidayByIdMutation, DeletePublicHolidayByIdMutationVariables>;
export const GetAllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"designation"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfJoining"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContactName"}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContactNumber"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"managerId"}},{"kind":"Field","name":{"kind":"Name","value":"vendorId"}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"designation"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfJoining"}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContactName"}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContactNumber"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"managerId"}},{"kind":"Field","name":{"kind":"Name","value":"vendorId"}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const GetAllVendorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllVendors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVendors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contactName"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllVendorsQuery, GetAllVendorsQueryVariables>;
export const CreateVendorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVendor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVendorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVendor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contactName"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]}}]} as unknown as DocumentNode<CreateVendorMutation, CreateVendorMutationVariables>;
export const UpdateVendorByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVendorById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVendorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVendorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contactName"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]}}]} as unknown as DocumentNode<UpdateVendorByIdMutation, UpdateVendorByIdMutationVariables>;
export const DeleteVendorByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteVendorById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteVendorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contactName"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]}}]} as unknown as DocumentNode<DeleteVendorByIdMutation, DeleteVendorByIdMutationVariables>;
export const GetPublicHolidaysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicHolidays"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPublicHolidays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"holidayDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetPublicHolidaysQuery, GetPublicHolidaysQueryVariables>;