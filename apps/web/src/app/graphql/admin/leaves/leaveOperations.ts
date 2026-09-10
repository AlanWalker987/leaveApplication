import { gql } from '@apollo/client';

export const GET_ALL_LEAVES = gql`
  query GetAllLeaves($offset: Int, $limit: Int, $status: LeaveStatus, $search: String) {
    getAllLeaves(offset: $offset, limit: $limit, status: $status, search: $search) {
      results {
        id
        userId
        managerId
        leaveTypeId
        leaveTypeCode
        leaveTypeDescription
        reason
        fromDate
        toDate
        totalDays
        status
        comments
        createdAt
        updatedAt
        canCancel
      }
      totalCount
    }
  }
`;
