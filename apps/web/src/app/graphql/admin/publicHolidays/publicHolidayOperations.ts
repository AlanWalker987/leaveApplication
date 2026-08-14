import { gql } from '@apollo/client';

export const GET_ALL_PUBLIC_HOLIDAYS = gql`
  query GetAllPublicHolidays($offset: Int, $limit: Int) {
    getPublicHolidays(offset: $offset, limit: $limit) {
      results {
        id
        holidayDate
        title
        createdAt
        updatedAt
        isDeleted
      }
    }
  }
`;
