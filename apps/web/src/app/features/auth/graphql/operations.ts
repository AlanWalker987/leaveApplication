import { gql } from '@apollo/client';

export const GET_BRANCHES = gql`
  query GetBranches($offset: Int, $limit: Int) {
    getBranches(offset: $offset, limit: $limit) {
      results {
        id
        name
        code
      }
    }
  }
`;

export const GET_VENDORS = gql`
  query GetVendors($offset: Int, $limit: Int) {
    getVendors(offset: $offset, limit: $limit) {
      results {
        id
        name
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      id
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      tokenType
      expiresIn
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      firstName
      lastName
      email
      userRole
      designation
      branchId
      vendorId
      gender
    }
  }
`;
