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
    "\n  query GetMe {\n    me {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      designation\n      branchId\n      vendorId\n    }\n  }\n": typeof types.GetMeDocument,
    "\n  query GetPublicHolidays($offset: Int, $limit: Int) {\n    getPublicHolidays(offset: $offset, limit: $limit) {\n      results {\n        id\n        title\n        holidayDate\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n": typeof types.GetPublicHolidaysDocument,
};
const documents: Documents = {
    "\n  query GetBranches($offset: Int, $limit: Int) {\n    getBranches(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n        code\n      }\n    }\n  }\n": types.GetBranchesDocument,
    "\n  query GetVendors($offset: Int, $limit: Int) {\n    getVendors(offset: $offset, limit: $limit) {\n      results {\n        id\n        name\n      }\n    }\n  }\n": types.GetVendorsDocument,
    "\n  mutation RegisterUser($input: RegisterInput!) {\n    register(input: $input) {\n      id\n      email\n    }\n  }\n": types.RegisterUserDocument,
    "\n  mutation LoginUser($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n      tokenType\n      expiresIn\n    }\n  }\n": types.LoginUserDocument,
    "\n  query GetMe {\n    me {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      designation\n      branchId\n      vendorId\n    }\n  }\n": types.GetMeDocument,
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
export function graphql(source: "\n  query GetMe {\n    me {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      designation\n      branchId\n      vendorId\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      id\n      firstName\n      lastName\n      email\n      userRole\n      designation\n      branchId\n      vendorId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPublicHolidays($offset: Int, $limit: Int) {\n    getPublicHolidays(offset: $offset, limit: $limit) {\n      results {\n        id\n        title\n        holidayDate\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPublicHolidays($offset: Int, $limit: Int) {\n    getPublicHolidays(offset: $offset, limit: $limit) {\n      results {\n        id\n        title\n        holidayDate\n        createdAt\n        isDeleted\n        updatedAt\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;