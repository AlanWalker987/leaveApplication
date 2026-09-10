import { gql } from '@apollo/client';

export const GET_ALL_DEPARTMENT_DETAILS = gql`
  query getDepartments($offset: Int, $limit: Int) {
    getDepartments(offset: $offset, limit: $limit) {
      results {
        id
        name
        subtitle
        location
        managerId
        manager {
          id
          firstName
          lastName
        }
        employees {
          id
          firstName
          lastName
        }
        createdAt
        isDeleted
        updatedAt
      }
    }
  }
`;

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      subtitle
      location
      managerId
      manager {
        id
        firstName
        lastName
      }
      employees {
        id
        firstName
        lastName
      }
      createdAt
      isDeleted
      updatedAt
    }
  }
`;

export const UPDATE_DEPARTMENT_BY_ID = gql`
  mutation UpdateDepartmentById($id: ID!, $input: UpdateDepartmentInput!) {
    updateDepartmentById(id: $id, input: $input) {
      id
      name
      subtitle
      location
      managerId
      manager {
        id
        firstName
        lastName
      }
      employees {
        id
        firstName
        lastName
      }
      createdAt
      isDeleted
      updatedAt
    }
  }
`;

export const DELETE_DEPARTMENT_BY_ID = gql`
  mutation DeleteDepartmentById($id: ID!) {
    deleteDepartmentById(id: $id) {
      id
      name
      subtitle
      location
      managerId
      manager {
        id
        firstName
        lastName
      }
      employees {
        id
        firstName
        lastName
      }
      createdAt
      isDeleted
      updatedAt
    }
  }
`;
