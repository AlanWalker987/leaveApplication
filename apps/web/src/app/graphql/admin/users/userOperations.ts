import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query GetAllUsers($offset: Int, $limit: Int) {
    getAllUsers(offset: $offset, limit: $limit) {
      results {
        id
        firstName
        lastName
        email
        phoneNumber
        designation
        userRole
        dateOfJoining
        dateOfBirth
        emergencyContactName
        emergencyContactNumber
        branchId
        managerId
        vendorId
        createAt
        isDeleted
        updatedAt
      }
    }
  }
`;
