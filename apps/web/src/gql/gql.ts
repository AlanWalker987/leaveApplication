/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetBranches($offset: Int, $limit: Int) {\n    getBranches(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        code\n      }\n    }\n  }\n": typeof types.GetBranchesDocument,
    "\n  query GetVendors($offset: Int, $limit: Int) {\n    getVendors(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetVendorsDocument,
    "\n  mutation RegisterUser($input: RegisterInput!) {\n    register(input: $input) {\n      id\n      email\n    }\n  }\n": typeof types.RegisterUserDocument,
    "\n  mutation LoginUser($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n      tokenType\n      expiresIn\n    }\n  }\n": typeof types.LoginUserDocument,
    "\n  query GetMe {\n    me {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      designation\n      branchId\n      vendorId\n      gender\n    }\n  }\n": typeof types.GetMeDocument,
    "\n  query GetAllBranchesAdmin($offset: Int, $limit: Int) {\n    getBranches(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        code\n        location\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n": typeof types.GetAllBranchesAdminDocument,
    "\n  mutation CreateBranch($input: CreateBranchInput!) {\n    createBranch(input: $input) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n": typeof types.CreateBranchDocument,
    "\n  mutation UpdateBranchById($id: ID!, $input: UpdateBranchInput!) {\n    updateBranchById(id: $id, input: $input) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n": typeof types.UpdateBranchByIdDocument,
    "\n  mutation DeleteBranchById($id: ID!) {\n    deleteBranchById(id: $id) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n": typeof types.DeleteBranchByIdDocument,
    "\n  query getDepartments($offset: Int, $limit: Int) {\n    getDepartments(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        subtitle\n        location\n        managerId\n        manager {\n          id\n          firstName\n          lastName\n        }\n        employees {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n": typeof types.GetDepartmentsDocument,
    "\n  mutation CreateDepartment($input: CreateDepartmentInput!) {\n    createDepartment(input: $input) {\n      id\n      name\n      subtitle\n      location\n      managerId\n      manager {\n        id\n        firstName\n        lastName\n      }\n      employees {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n": typeof types.CreateDepartmentDocument,
    "\n  mutation UpdateDepartmentById($id: ID!, $input: UpdateDepartmentInput!) {\n    updateDepartmentById(id: $id, input: $input) {\n      id\n      name\n      subtitle\n      location\n      managerId\n      manager {\n        id\n        firstName\n        lastName\n      }\n      employees {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n": typeof types.UpdateDepartmentByIdDocument,
    "\n  query GetAllLeaveTypes($offset: Int, $limit: Int) {\n    getLeaveTypes(offset: $offset, limit: $limit) {\n      results {\n        id\n        code\n        description\n        createAt\n        updatedAt\n        isDeleted\n      }\n    }\n  }\n": typeof types.GetAllLeaveTypesDocument,
    "\n  mutation CreateLeaveType($input: CreateLeaveTypeInput!) {\n    createLeaveType(input: $input) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n": typeof types.CreateLeaveTypeDocument,
    "\n  mutation UpdateLeaveTypeById($id: ID!, $input: UpdateLeaveTypeInput!) {\n    updateLeaveTypeById(id: $id, input: $input) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n": typeof types.UpdateLeaveTypeByIdDocument,
    "\n  mutation DeleteLeaveTypeById($id: ID!) {\n    deleteLeaveTypeById(id: $id) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n": typeof types.DeleteLeaveTypeByIdDocument,
    "\n  query GetAllPublicHolidays($offset: Int, $limit: Int) {\n    getPublicHolidays(offset: $offset, limit: $limit) {\n      results {\n        id\n        holidayDate\n        title\n        createdAt\n        updatedAt\n        isDeleted\n      }\n    }\n  }\n": typeof types.GetAllPublicHolidaysDocument,
    "\n  mutation CreatePublicHoliday($input: CreatePublicHolidayInput!) {\n    createPublicHoliday(input: $input) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": typeof types.CreatePublicHolidayDocument,
    "\n  mutation UpdatePublicHolidayById($id: ID!, $input: UpdatePublicHolidayInput!) {\n    updatePublicHolidayById(id: $id, input: $input) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": typeof types.UpdatePublicHolidayByIdDocument,
    "\n  mutation DeletePublicHolidayById($id: ID!) {\n    deletePublicHolidayById(id: $id) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": typeof types.DeletePublicHolidayByIdDocument,
    "\n  query GetAllUsers($offset: Int, $limit: Int) {\n    getAllUsers(offset: $offset, limit: $limit) {\n      results {\n        id\n        firstName\n        lastName\n        email\n        phoneNumber\n        designation\n        userRole\n        dateOfJoining\n        dateOfBirth\n        emergencyContactName\n        emergencyContactNumber\n        branchId\n        managerId\n        vendorId\n        createAt\n        isDeleted\n        updatedAt\n        gender\n      }\n    }\n  }\n": typeof types.GetAllUsersDocument,
    "\n  mutation CreateUser($input: RegisterInput!) {\n    register(input: $input) {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      phoneNumber\n      designation\n      dateOfBirth\n      dateOfJoining\n      emergencyContactName\n      emergencyContactNumber\n      branchId\n      managerId\n      vendorId\n      createAt\n      updatedAt\n      isDeleted\n      gender\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  query GetAllVendors($offset: Int, $limit: Int) {\n    getVendors(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        contactName\n        contactEmail\n        contactNumber\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n": typeof types.GetAllVendorsDocument,
    "\n  mutation CreateVendor($input: CreateVendorInput!) {\n    createVendor(input: $input) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": typeof types.CreateVendorDocument,
    "\n  mutation UpdateVendorById($id: ID!, $input: UpdateVendorInput!) {\n    updateVendorById(id: $id, input: $input) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": typeof types.UpdateVendorByIdDocument,
    "\n  mutation DeleteVendorById($id: ID!) {\n    deleteVendorById(id: $id) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": typeof types.DeleteVendorByIdDocument,
    "\n  query GetPublicHolidays($offset: Int, $limit: Int) {\n    getPublicHolidays(offset: $offset, limit: $limit) {\n      results {\n        id\n        title\n        holidayDate\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n": typeof types.GetPublicHolidaysDocument,
};
const documents: Documents = {
    "\n  query GetBranches($offset: Int, $limit: Int) {\n    getBranches(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        code\n      }\n    }\n  }\n": types.GetBranchesDocument,
    "\n  query GetVendors($offset: Int, $limit: Int) {\n    getVendors(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n      }\n    }\n  }\n": types.GetVendorsDocument,
    "\n  mutation RegisterUser($input: RegisterInput!) {\n    register(input: $input) {\n      id\n      email\n    }\n  }\n": types.RegisterUserDocument,
    "\n  mutation LoginUser($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n      tokenType\n      expiresIn\n    }\n  }\n": types.LoginUserDocument,
    "\n  query GetMe {\n    me {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      designation\n      branchId\n      vendorId\n      gender\n    }\n  }\n": types.GetMeDocument,
    "\n  query GetAllBranchesAdmin($offset: Int, $limit: Int) {\n    getBranches(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        code\n        location\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n": types.GetAllBranchesAdminDocument,
    "\n  mutation CreateBranch($input: CreateBranchInput!) {\n    createBranch(input: $input) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n": types.CreateBranchDocument,
    "\n  mutation UpdateBranchById($id: ID!, $input: UpdateBranchInput!) {\n    updateBranchById(id: $id, input: $input) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n": types.UpdateBranchByIdDocument,
    "\n  mutation DeleteBranchById($id: ID!) {\n    deleteBranchById(id: $id) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n": types.DeleteBranchByIdDocument,
    "\n  query getDepartments($offset: Int, $limit: Int) {\n    getDepartments(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        subtitle\n        location\n        managerId\n        manager {\n          id\n          firstName\n          lastName\n        }\n        employees {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n": types.GetDepartmentsDocument,
    "\n  mutation CreateDepartment($input: CreateDepartmentInput!) {\n    createDepartment(input: $input) {\n      id\n      name\n      subtitle\n      location\n      managerId\n      manager {\n        id\n        firstName\n        lastName\n      }\n      employees {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n": types.CreateDepartmentDocument,
    "\n  mutation UpdateDepartmentById($id: ID!, $input: UpdateDepartmentInput!) {\n    updateDepartmentById(id: $id, input: $input) {\n      id\n      name\n      subtitle\n      location\n      managerId\n      manager {\n        id\n        firstName\n        lastName\n      }\n      employees {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n": types.UpdateDepartmentByIdDocument,
    "\n  query GetAllLeaveTypes($offset: Int, $limit: Int) {\n    getLeaveTypes(offset: $offset, limit: $limit) {\n      results {\n        id\n        code\n        description\n        createAt\n        updatedAt\n        isDeleted\n      }\n    }\n  }\n": types.GetAllLeaveTypesDocument,
    "\n  mutation CreateLeaveType($input: CreateLeaveTypeInput!) {\n    createLeaveType(input: $input) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n": types.CreateLeaveTypeDocument,
    "\n  mutation UpdateLeaveTypeById($id: ID!, $input: UpdateLeaveTypeInput!) {\n    updateLeaveTypeById(id: $id, input: $input) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n": types.UpdateLeaveTypeByIdDocument,
    "\n  mutation DeleteLeaveTypeById($id: ID!) {\n    deleteLeaveTypeById(id: $id) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n": types.DeleteLeaveTypeByIdDocument,
    "\n  query GetAllPublicHolidays($offset: Int, $limit: Int) {\n    getPublicHolidays(offset: $offset, limit: $limit) {\n      results {\n        id\n        holidayDate\n        title\n        createdAt\n        updatedAt\n        isDeleted\n      }\n    }\n  }\n": types.GetAllPublicHolidaysDocument,
    "\n  mutation CreatePublicHoliday($input: CreatePublicHolidayInput!) {\n    createPublicHoliday(input: $input) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": types.CreatePublicHolidayDocument,
    "\n  mutation UpdatePublicHolidayById($id: ID!, $input: UpdatePublicHolidayInput!) {\n    updatePublicHolidayById(id: $id, input: $input) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": types.UpdatePublicHolidayByIdDocument,
    "\n  mutation DeletePublicHolidayById($id: ID!) {\n    deletePublicHolidayById(id: $id) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": types.DeletePublicHolidayByIdDocument,
    "\n  query GetAllUsers($offset: Int, $limit: Int) {\n    getAllUsers(offset: $offset, limit: $limit) {\n      results {\n        id\n        firstName\n        lastName\n        email\n        phoneNumber\n        designation\n        userRole\n        dateOfJoining\n        dateOfBirth\n        emergencyContactName\n        emergencyContactNumber\n        branchId\n        managerId\n        vendorId\n        createAt\n        isDeleted\n        updatedAt\n        gender\n      }\n    }\n  }\n": types.GetAllUsersDocument,
    "\n  mutation CreateUser($input: RegisterInput!) {\n    register(input: $input) {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      phoneNumber\n      designation\n      dateOfBirth\n      dateOfJoining\n      emergencyContactName\n      emergencyContactNumber\n      branchId\n      managerId\n      vendorId\n      createAt\n      updatedAt\n      isDeleted\n      gender\n    }\n  }\n": types.CreateUserDocument,
    "\n  query GetAllVendors($offset: Int, $limit: Int) {\n    getVendors(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        contactName\n        contactEmail\n        contactNumber\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n": types.GetAllVendorsDocument,
    "\n  mutation CreateVendor($input: CreateVendorInput!) {\n    createVendor(input: $input) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": types.CreateVendorDocument,
    "\n  mutation UpdateVendorById($id: ID!, $input: UpdateVendorInput!) {\n    updateVendorById(id: $id, input: $input) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": types.UpdateVendorByIdDocument,
    "\n  mutation DeleteVendorById($id: ID!) {\n    deleteVendorById(id: $id) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n": types.DeleteVendorByIdDocument,
    "\n  query GetPublicHolidays($offset: Int, $limit: Int) {\n    getPublicHolidays(offset: $offset, limit: $limit) {\n      results {\n        id\n        title\n        holidayDate\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n": types.GetPublicHolidaysDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBranches($offset: Int, $limit: Int) {\n    getBranches(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetBranches($offset: Int, $limit: Int) {\n    getBranches(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        code\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetVendors($offset: Int, $limit: Int) {\n    getVendors(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetVendors($offset: Int, $limit: Int) {\n    getVendors(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RegisterUser($input: RegisterInput!) {\n    register(input: $input) {\n      id\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation RegisterUser($input: RegisterInput!) {\n    register(input: $input) {\n      id\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LoginUser($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n      tokenType\n      expiresIn\n    }\n  }\n"): (typeof documents)["\n  mutation LoginUser($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n      tokenType\n      expiresIn\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMe {\n    me {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      designation\n      branchId\n      vendorId\n      gender\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      designation\n      branchId\n      vendorId\n      gender\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllBranchesAdmin($offset: Int, $limit: Int) {\n    getBranches(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        code\n        location\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllBranchesAdmin($offset: Int, $limit: Int) {\n    getBranches(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        code\n        location\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateBranch($input: CreateBranchInput!) {\n    createBranch(input: $input) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateBranch($input: CreateBranchInput!) {\n    createBranch(input: $input) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateBranchById($id: ID!, $input: UpdateBranchInput!) {\n    updateBranchById(id: $id, input: $input) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateBranchById($id: ID!, $input: UpdateBranchInput!) {\n    updateBranchById(id: $id, input: $input) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteBranchById($id: ID!) {\n    deleteBranchById(id: $id) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteBranchById($id: ID!) {\n    deleteBranchById(id: $id) {\n      id\n      name\n      code\n      location\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getDepartments($offset: Int, $limit: Int) {\n    getDepartments(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        subtitle\n        location\n        managerId\n        manager {\n          id\n          firstName\n          lastName\n        }\n        employees {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query getDepartments($offset: Int, $limit: Int) {\n    getDepartments(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        subtitle\n        location\n        managerId\n        manager {\n          id\n          firstName\n          lastName\n        }\n        employees {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDepartment($input: CreateDepartmentInput!) {\n    createDepartment(input: $input) {\n      id\n      name\n      subtitle\n      location\n      managerId\n      manager {\n        id\n        firstName\n        lastName\n      }\n      employees {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDepartment($input: CreateDepartmentInput!) {\n    createDepartment(input: $input) {\n      id\n      name\n      subtitle\n      location\n      managerId\n      manager {\n        id\n        firstName\n        lastName\n      }\n      employees {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateDepartmentById($id: ID!, $input: UpdateDepartmentInput!) {\n    updateDepartmentById(id: $id, input: $input) {\n      id\n      name\n      subtitle\n      location\n      managerId\n      manager {\n        id\n        firstName\n        lastName\n      }\n      employees {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDepartmentById($id: ID!, $input: UpdateDepartmentInput!) {\n    updateDepartmentById(id: $id, input: $input) {\n      id\n      name\n      subtitle\n      location\n      managerId\n      manager {\n        id\n        firstName\n        lastName\n      }\n      employees {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      isDeleted\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllLeaveTypes($offset: Int, $limit: Int) {\n    getLeaveTypes(offset: $offset, limit: $limit) {\n      results {\n        id\n        code\n        description\n        createAt\n        updatedAt\n        isDeleted\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllLeaveTypes($offset: Int, $limit: Int) {\n    getLeaveTypes(offset: $offset, limit: $limit) {\n      results {\n        id\n        code\n        description\n        createAt\n        updatedAt\n        isDeleted\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateLeaveType($input: CreateLeaveTypeInput!) {\n    createLeaveType(input: $input) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLeaveType($input: CreateLeaveTypeInput!) {\n    createLeaveType(input: $input) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateLeaveTypeById($id: ID!, $input: UpdateLeaveTypeInput!) {\n    updateLeaveTypeById(id: $id, input: $input) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateLeaveTypeById($id: ID!, $input: UpdateLeaveTypeInput!) {\n    updateLeaveTypeById(id: $id, input: $input) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteLeaveTypeById($id: ID!) {\n    deleteLeaveTypeById(id: $id) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteLeaveTypeById($id: ID!) {\n    deleteLeaveTypeById(id: $id) {\n      id\n      code\n      description\n      createAt\n      isDeleted\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllPublicHolidays($offset: Int, $limit: Int) {\n    getPublicHolidays(offset: $offset, limit: $limit) {\n      results {\n        id\n        holidayDate\n        title\n        createdAt\n        updatedAt\n        isDeleted\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllPublicHolidays($offset: Int, $limit: Int) {\n    getPublicHolidays(offset: $offset, limit: $limit) {\n      results {\n        id\n        holidayDate\n        title\n        createdAt\n        updatedAt\n        isDeleted\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePublicHoliday($input: CreatePublicHolidayInput!) {\n    createPublicHoliday(input: $input) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePublicHoliday($input: CreatePublicHolidayInput!) {\n    createPublicHoliday(input: $input) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePublicHolidayById($id: ID!, $input: UpdatePublicHolidayInput!) {\n    updatePublicHolidayById(id: $id, input: $input) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePublicHolidayById($id: ID!, $input: UpdatePublicHolidayInput!) {\n    updatePublicHolidayById(id: $id, input: $input) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePublicHolidayById($id: ID!) {\n    deletePublicHolidayById(id: $id) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePublicHolidayById($id: ID!) {\n    deletePublicHolidayById(id: $id) {\n      id\n      holidayDate\n      title\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllUsers($offset: Int, $limit: Int) {\n    getAllUsers(offset: $offset, limit: $limit) {\n      results {\n        id\n        firstName\n        lastName\n        email\n        phoneNumber\n        designation\n        userRole\n        dateOfJoining\n        dateOfBirth\n        emergencyContactName\n        emergencyContactNumber\n        branchId\n        managerId\n        vendorId\n        createAt\n        isDeleted\n        updatedAt\n        gender\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllUsers($offset: Int, $limit: Int) {\n    getAllUsers(offset: $offset, limit: $limit) {\n      results {\n        id\n        firstName\n        lastName\n        email\n        phoneNumber\n        designation\n        userRole\n        dateOfJoining\n        dateOfBirth\n        emergencyContactName\n        emergencyContactNumber\n        branchId\n        managerId\n        vendorId\n        createAt\n        isDeleted\n        updatedAt\n        gender\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($input: RegisterInput!) {\n    register(input: $input) {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      phoneNumber\n      designation\n      dateOfBirth\n      dateOfJoining\n      emergencyContactName\n      emergencyContactNumber\n      branchId\n      managerId\n      vendorId\n      createAt\n      updatedAt\n      isDeleted\n      gender\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($input: RegisterInput!) {\n    register(input: $input) {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      phoneNumber\n      designation\n      dateOfBirth\n      dateOfJoining\n      emergencyContactName\n      emergencyContactNumber\n      branchId\n      managerId\n      vendorId\n      createAt\n      updatedAt\n      isDeleted\n      gender\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllVendors($offset: Int, $limit: Int) {\n    getVendors(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        contactName\n        contactEmail\n        contactNumber\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllVendors($offset: Int, $limit: Int) {\n    getVendors(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        contactName\n        contactEmail\n        contactNumber\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateVendor($input: CreateVendorInput!) {\n    createVendor(input: $input) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"): (typeof documents)["\n  mutation CreateVendor($input: CreateVendorInput!) {\n    createVendor(input: $input) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateVendorById($id: ID!, $input: UpdateVendorInput!) {\n    updateVendorById(id: $id, input: $input) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateVendorById($id: ID!, $input: UpdateVendorInput!) {\n    updateVendorById(id: $id, input: $input) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteVendorById($id: ID!) {\n    deleteVendorById(id: $id) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteVendorById($id: ID!) {\n    deleteVendorById(id: $id) {\n      id\n      name\n      contactName\n      contactEmail\n      contactNumber\n      createdAt\n      updatedAt\n      isDeleted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPublicHolidays($offset: Int, $limit: Int) {\n    getPublicHolidays(offset: $offset, limit: $limit) {\n      results {\n        id\n        title\n        holidayDate\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPublicHolidays($offset: Int, $limit: Int) {\n    getPublicHolidays(offset: $offset, limit: $limit) {\n      results {\n        id\n        title\n        holidayDate\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;