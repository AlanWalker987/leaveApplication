/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Role {
  Admin = 'Admin',
  Manager = 'Manager',
  Employee = 'Employee',
}

export class CreateBranchInput {
  code: string;
  name: string;
  location: string;
}

export class UpdateBranchInput {
  code?: Nullable<string>;
  name?: Nullable<string>;
  location?: Nullable<string>;
}

export class CreateLeaveTypeInput {
  code: string;
  description: string;
}

export class UpdateLeaveTypeInput {
  code?: Nullable<string>;
  description?: Nullable<string>;
}

export class CreatePublicHolidayInput {
  holidayDate: DateTime;
  title: string;
}

export class UpdatePublicHolidayInput {
  holidayDate?: Nullable<DateTime>;
  title?: Nullable<string>;
}

export class RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  managerId?: Nullable<string>;
  branchId?: Nullable<string>;
  vendorId?: Nullable<string>;
  userRole: Role;
  phoneNumber: string;
  designation: string;
  dateOfBirth: DateTime;
  dateOfJoining: DateTime;
  emergencyContactName: string;
  emergencyContactNumber: string;
}

export class LoginInput {
  email: string;
  password: string;
}

export class RefreshTokenInput {
  refreshToken: string;
}

export class CreateVendorInput {
  name: string;
  contactName: string;
  contactNumber: string;
  contactEmail: string;
}

export class UpdateVendorInput {
  name?: Nullable<string>;
  contactName?: Nullable<string>;
  contactNumber?: Nullable<string>;
  contactEmail?: Nullable<string>;
}

export class Branch {
  id: string;
  code: string;
  name: string;
  location: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  isDeleted: boolean;
}

export class BranchListResponse {
  results: Branch[];
  totalCount: number;
}

export abstract class IQuery {
  health: string;
  getBranches?: BranchListResponse;
  getBranchById?: Nullable<Branch>;
  getLeaveTypes?: LeaveTypeListResponse;
  getLeaveTypeById?: Nullable<LeaveType>;
  getPublicHolidays?: PublicHolidayListResponse;
  getPublicHolidayById?: Nullable<PublicHoliday>;
  me?: Nullable<User>;
  getVendors?: VendorListResponse;
  getVendorById?: Nullable<Vendor>;
}

export abstract class IMutation {
  createBranch?: Nullable<Branch>;
  updateBranchById?: Nullable<Branch>;
  deleteBranchById?: Nullable<Branch>;
  createLeaveType?: Nullable<LeaveType>;
  updateLeaveTypeById?: Nullable<LeaveType>;
  deleteLeaveTypeById?: Nullable<LeaveType>;
  createPublicHoliday?: Nullable<PublicHoliday>;
  updatePublicHolidayById?: Nullable<PublicHoliday>;
  deletePublicHolidayById?: Nullable<PublicHoliday>;
  register?: User;
  login?: AuthTokens;
  refreshToken?: AuthTokens;
  logoutAllTabs: boolean;
  createVendor?: Nullable<Vendor>;
  updateVendorById?: Nullable<Vendor>;
  deleteVendorById?: Nullable<Vendor>;
}

export class LeaveType {
  id: string;
  code: string;
  description: string;
  createAt: DateTime;
  updatedAt: DateTime;
  isDeleted: boolean;
}

export class LeaveTypeListResponse {
  results: LeaveType[];
  totalCount: number;
}

export class PublicHoliday {
  id: string;
  holidayDate: DateTime;
  title: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  isDeleted: boolean;
}

export class PublicHolidayListResponse {
  results: PublicHoliday[];
  totalCount: number;
}

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  managerId?: Nullable<string>;
  branchId?: Nullable<string>;
  vendorId?: Nullable<string>;
  userRole: Role;
  phoneNumber: string;
  designation: string;
  dateOfBirth: DateTime;
  dateOfJoining: DateTime;
  emergencyContactName: string;
  emergencyContactNumber: string;
  createAt: DateTime;
  updatedAt: DateTime;
  isDeleted: boolean;
}

export class AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export class Vendor {
  id: string;
  name: string;
  contactName: string;
  contactNumber: string;
  contactEmail: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  isDeleted: boolean;
}

export class VendorListResponse {
  results: Vendor[];
  totalCount: number;
}

export type DateTime = any;
type Nullable<T> = T | null;
