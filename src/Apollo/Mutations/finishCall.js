import gql from 'graphql-tag';

const CALENDAR_FINISH_CALL = gql`
  mutation finishCall($callId: ID!) {
    finishCall(callId: $callId) {
      isSuccess
      message
      event {
        _id
      }
    }
  }
`;

export default CALENDAR_FINISH_CALL;
