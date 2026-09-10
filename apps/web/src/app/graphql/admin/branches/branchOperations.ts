import { gql } from '@apollo/client';

export const GET_ALL_BRANCHES = gql`
  query GetAllBranchesAdmin(
    $offset: Int
    $limit: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    getBranches(
      offset: $offset
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      results {
        id
        name
        code
        location
        createdAt
        isDeleted
        updatedAt
      }
      totalCount
    }
  }
`;

export const CREATE_BRANCH = gql`
  mutation CreateBranch($input: CreateBranchInput!) {
    createBranch(input: $input) {
      id
      name
      code
      location
      createdAt
      isDeleted
      updatedAt
    }
  }
`;

export const UPDATE_BRANCH_BY_ID = gql`
  mutation UpdateBranchById($id: ID!, $input: UpdateBranchInput!) {
    updateBranchById(id: $id, input: $input) {
      id
      name
      code
      location
      createdAt
      isDeleted
      updatedAt
    }
  }
`;

export const DELETE_BRANCH_BY_ID = gql`
  mutation DeleteBranchById($id: ID!) {
    deleteBranchById(id: $id) {
      id
      name
      code
      location
      createdAt
      isDeleted
      updatedAt
    }
  }
`;
