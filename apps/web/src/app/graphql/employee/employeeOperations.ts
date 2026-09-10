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

export const GET_MY_LEAVES = gql`
  query GetMyLeaves($offset: Int, $limit: Int) {
    getMyLeaves(offset: $offset, limit: $limit) {
      totalCount
      results {
        id
        leaveTypeCode
        leaveTypeDescription
        reason
        fromDate
        toDate
        totalDays
        status
        comments
        createdAt
        canCancel
      }
    }
  }
`;

export const CREATE_LEAVE = gql`
  mutation CreateLeave($input: CreateLeaveInput!) {
    createLeave(input: $input) {
      id
      leaveTypeCode
      leaveTypeDescription
      reason
      fromDate
      toDate
      totalDays
      status
      comments
      createdAt
      canCancel
    }
  }
`;

export const CANCEL_LEAVE_BY_ID = gql`
  mutation CancelLeaveById($id: ID!) {
    cancelLeaveById(id: $id) {
      id
      status
      comments
      canCancel
      updatedAt
    }
  }
`;
