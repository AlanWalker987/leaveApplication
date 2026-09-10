import { gql } from '@apollo/client';

export const GET_ALL_VENDORS = gql`
  query GetAllVendors(
    $offset: Int
    $limit: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    getVendors(
      offset: $offset
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
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
      totalCount
    }
  }
`;

export const CREATE_VENDOR = gql`
  mutation CreateVendor($input: CreateVendorInput!) {
    createVendor(input: $input) {
      id
      name
      contactName
      contactEmail
      contactNumber
      createdAt
      updatedAt
      isDeleted
    }
  }
`;

export const UPDATE_VENDOR_BY_ID = gql`
  mutation UpdateVendorById($id: ID!, $input: UpdateVendorInput!) {
    updateVendorById(id: $id, input: $input) {
      id
      name
      contactName
      contactEmail
      contactNumber
      createdAt
      updatedAt
      isDeleted
    }
  }
`;

export const DELETE_VENDOR_BY_ID = gql`
  mutation DeleteVendorById($id: ID!) {
    deleteVendorById(id: $id) {
      id
      name
      contactName
      contactEmail
      contactNumber
      createdAt
      updatedAt
      isDeleted
    }
  }
`;
