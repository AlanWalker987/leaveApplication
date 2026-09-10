import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query GetAllUsers(
    $offset: Int
    $limit: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    getAllUsers(
      offset: $offset
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
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
        gender
      }
      totalCount
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: RegisterInput!) {
    register(input: $input) {
      id
      firstName
      lastName
      email
      userRole
      phoneNumber
      designation
      dateOfBirth
      dateOfJoining
      emergencyContactName
      emergencyContactNumber
      branchId
      managerId
      vendorId
      createAt
      updatedAt
      isDeleted
      gender
    }
  }
`;

export const UPDATE_USER_BY_ID = gql`
  mutation UpdateUserById($id: ID!, $input: UpdateUserInput!) {
    updateUserById(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      userRole
      phoneNumber
      designation
      dateOfBirth
      dateOfJoining
      emergencyContactName
      emergencyContactNumber
      branchId
      managerId
      vendorId
      createAt
      updatedAt
      isDeleted
      gender
    }
  }
`;

export const DELETE_USER_BY_ID = gql`
  mutation DeleteUserById($id: ID!) {
    deleteUserById(id: $id) {
      id
      firstName
      lastName
      email
      userRole
      phoneNumber
      designation
      dateOfBirth
      dateOfJoining
      emergencyContactName
      emergencyContactNumber
      branchId
      managerId
      vendorId
      createAt
      updatedAt
      isDeleted
      gender
    }
  }
`;
