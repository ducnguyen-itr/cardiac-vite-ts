import gql from 'graphql-tag';

const CALENDAR_LEAVE_CALL = gql`
  mutation leaveCall($callId: ID!) {
    leaveCall(callId: $callId) {
      isSuccess
      message
    }
  }
`;

export default CALENDAR_LEAVE_CALL;
