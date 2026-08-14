import { gql } from '@apollo/client';

export const GET_ALL_VENDORS = gql`
  query GetAllVendors($offset: Int, $limit: Int) {
    getVendors(offset: $offset, limit: $limit) {
      results {
        id
        name
        contactName
        contactEmail
        contactNumber
        createdAt
        isDeleted
        updatedAt
      }
    }
  }
`;
