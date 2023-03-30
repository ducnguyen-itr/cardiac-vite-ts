import gql from 'graphql-tag';

const MARK_ALL_AS_DONE_TIME_LOG = gql`
  mutation markAllAsDoneTimeLog($carePlan: ID!, $timeTrackingId: ID!) {
    markAllAsDoneTimeLog(carePlan: $carePlan, timeTrackingId: $timeTrackingId) {
      isSuccess
      message
    }
  }
`;

export default MARK_ALL_AS_DONE_TIME_LOG;
