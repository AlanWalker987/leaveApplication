import { gql } from '@apollo/client';

export const GET_TEAM_LEAVES = gql`
  query GetTeamLeaves($offset: Int, $limit: Int, $status: LeaveStatus) {
    getTeamLeaves(offset: $offset, limit: $limit, status: $status) {
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

export const REVIEW_LEAVE_BY_ID = gql`
  mutation ReviewLeaveById($id: ID!, $status: LeaveStatus!, $comments: String) {
    reviewLeaveById(id: $id, status: $status, comments: $comments) {
      id
      status
      comments
      updatedAt
    }
  }
`;
