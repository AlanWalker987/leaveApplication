import { gql } from '@apollo/client';

export const GET_ALL_PUBLIC_HOLIDAYS = gql`
  query GetAllPublicHolidays(
    $offset: Int
    $limit: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    getPublicHolidays(
      offset: $offset
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      results {
        id
        holidayDate
        title
        createdAt
        updatedAt
        isDeleted
      }
      totalCount
    }
  }
`;

export const CREATE_PUBLIC_HOLIDAY = gql`
  mutation CreatePublicHoliday($input: CreatePublicHolidayInput!) {
    createPublicHoliday(input: $input) {
      id
      holidayDate
      title
      createdAt
      updatedAt
      isDeleted
    }
  }
`;

export const UPDATE_PUBLIC_HOLIDAY_BY_ID = gql`
  mutation UpdatePublicHolidayById($id: ID!, $input: UpdatePublicHolidayInput!) {
    updatePublicHolidayById(id: $id, input: $input) {
      id
      holidayDate
      title
      createdAt
      updatedAt
      isDeleted
    }
  }
`;

export const DELETE_PUBLIC_HOLIDAY_BY_ID = gql`
  mutation DeletePublicHolidayById($id: ID!) {
    deletePublicHolidayById(id: $id) {
      id
      holidayDate
      title
      createdAt
      updatedAt
      isDeleted
    }
  }
`;
