import { gql } from '@apollo/client';

export const GET_ALL_BRANCHES = gql`
  query GetAllBranchesAdmin($offset: Int, $limit: Int) {
    getBranches(offset: $offset, limit: $limit) {
      results {
        id
        name
        code
        location
        createdAt
        isDeleted
        updatedAt
      }
    }
  }
`;
