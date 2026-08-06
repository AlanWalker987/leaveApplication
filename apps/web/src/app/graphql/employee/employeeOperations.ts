import { gql } from '@apollo/client';

export const GET_PUBLIC_HOLIDAYS = gql`
  query GetPublicHolidays($offset: Int, $limit: Int) {
    getPublicHolidays(offset: $offset, limit: $limit) {
      results {
        id
        title
        holidayDate
        createdAt
        isDeleted
        updatedAt
      }
    }
  }
`;
