import { gql } from '@apollo/client';

export const GET_ALL_LEAVE_TYPES = gql`
  query GetAllLeaveTypes(
    $offset: Int
    $limit: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    getLeaveTypes(
      offset: $offset
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      results {
        id
        code
        description
        createAt
        updatedAt
        isDeleted
      }
      totalCount
    }
  }
`;

export const CREATE_LEAVETYPE = gql`
  mutation CreateLeaveType($input: CreateLeaveTypeInput!) {
    createLeaveType(input: $input) {
      id
      code
      description
      createAt
      isDeleted
      updatedAt
    }
  }
`;

export const UPDATE_LEAVETYPE_BY_ID = gql`
  mutation UpdateLeaveTypeById($id: ID!, $input: UpdateLeaveTypeInput!) {
    updateLeaveTypeById(id: $id, input: $input) {
      id
      code
      description
      createAt
      isDeleted
      updatedAt
    }
  }
`;

export const DELETE_LEAVETYPE_BY_ID = gql`
  mutation DeleteLeaveTypeById($id: ID!) {
    deleteLeaveTypeById(id: $id) {
      id
      code
      description
      createAt
      isDeleted
      updatedAt
    }
  }
`;
