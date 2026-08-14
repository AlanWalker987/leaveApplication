import { gql } from '@apollo/client';

export const GET_ALL_LEAVE_TYPES = gql`
  query GetAllLeaveTypes($offset: Int, $limit: Int) {
    getLeaveTypes(offset: $offset, limit: $limit) {
      results {
        id
        code
        description
        createAt
        updatedAt
        isDeleted
      }
    }
  }
`;
