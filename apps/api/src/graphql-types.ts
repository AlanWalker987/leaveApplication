
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum LeaveStatus {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
    Cancelled = "Cancelled"
}

export enum Role {
    Admin = "Admin",
    Manager = "Manager",
    Employee = "Employee"
}

export enum Gender {
    Male = "Male",
    Female = "Female"
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

export class CreateDepartmentInput {
    name: string;
    subtitle: string;
    location: string;
    managerId: string;
    employeeIds?: Nullable<string[]>;
}

export class UpdateDepartmentInput {
    name?: Nullable<string>;
    subtitle?: Nullable<string>;
    location?: Nullable<string>;
    managerId?: Nullable<string>;
    employeeIds?: Nullable<string[]>;
}

export class CreateLeaveTypeInput {
    code: string;
    description: string;
}

export class UpdateLeaveTypeInput {
    code?: Nullable<string>;
    description?: Nullable<string>;
}

export class CreateLeaveInput {
    leaveTypeCode: string;
    reason: string;
    fromDate: DateTime;
    toDate: DateTime;
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
    gender?: Nullable<Gender>;
}

export class UpdateUserInput {
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    email?: Nullable<string>;
    managerId?: Nullable<string>;
    branchId?: Nullable<string>;
    vendorId?: Nullable<string>;
    userRole?: Nullable<Role>;
    phoneNumber?: Nullable<string>;
    designation?: Nullable<string>;
    dateOfBirth?: Nullable<DateTime>;
    dateOfJoining?: Nullable<DateTime>;
    emergencyContactName?: Nullable<string>;
    emergencyContactNumber?: Nullable<string>;
    gender?: Nullable<Gender>;
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
    getDepartments?: DepartmentListResponse;
    getDepartmentById?: Nullable<Department>;
    getLeaveTypes?: LeaveTypeListResponse;
    getLeaveTypeById?: Nullable<LeaveType>;
    getMyLeaves?: LeaveListResponse;
    getTeamLeaves?: LeaveListResponse;
    getAllLeaves?: LeaveListResponse;
    getPublicHolidays?: PublicHolidayListResponse;
    getPublicHolidayById?: Nullable<PublicHoliday>;
    me?: Nullable<User>;
    getAllUsers?: UserListResponse;
    getVendors?: VendorListResponse;
    getVendorById?: Nullable<Vendor>;
}

export abstract class IMutation {
    createBranch?: Nullable<Branch>;
    updateBranchById?: Nullable<Branch>;
    deleteBranchById?: Nullable<Branch>;
    createDepartment?: Nullable<Department>;
    updateDepartmentById?: Nullable<Department>;
    deleteDepartmentById?: Nullable<Department>;
    createLeaveType?: Nullable<LeaveType>;
    updateLeaveTypeById?: Nullable<LeaveType>;
    deleteLeaveTypeById?: Nullable<LeaveType>;
    createLeave?: LeaveRequest;
    cancelLeaveById?: LeaveRequest;
    reviewLeaveById?: LeaveRequest;
    createPublicHoliday?: Nullable<PublicHoliday>;
    updatePublicHolidayById?: Nullable<PublicHoliday>;
    deletePublicHolidayById?: Nullable<PublicHoliday>;
    register?: User;
    updateUserById?: User;
    login?: AuthTokens;
    refreshToken?: AuthTokens;
    logoutAllTabs: boolean;
    createVendor?: Nullable<Vendor>;
    updateVendorById?: Nullable<Vendor>;
    deleteVendorById?: Nullable<Vendor>;
}

export class Department {
    id: string;
    name: string;
    subtitle: string;
    location: string;
    managerId: string;
    manager: User;
    employees: User[];
    createdAt: DateTime;
    updatedAt: DateTime;
    isDeleted: boolean;
}

export class DepartmentListResponse {
    results: Department[];
    totalCount: number;
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

export class LeaveRequest {
    id: string;
    userId: string;
    managerId?: Nullable<string>;
    leaveTypeId: string;
    leaveTypeCode: string;
    leaveTypeDescription: string;
    reason: string;
    fromDate: DateTime;
    toDate: DateTime;
    totalDays: number;
    status: LeaveStatus;
    comments?: Nullable<string>;
    createdAt: DateTime;
    updatedAt: DateTime;
    isDeleted: boolean;
    canCancel: boolean;
}

export class LeaveListResponse {
    results: LeaveRequest[];
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
    gender?: Nullable<Gender>;
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

export class UserListResponse {
    results: User[];
    totalCount: number;
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
