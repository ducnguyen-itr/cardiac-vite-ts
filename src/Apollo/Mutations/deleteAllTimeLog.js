import gql from 'graphql-tag';

const DELETE_ALL_TIME_LOG = gql`
  mutation deleteAllTimeLog($carePlanId: ID!, $timeTrackingId: ID!, $status: TimeLogStatusEnum) {
    deleteAllTimeLog(carePlanId: $carePlanId, timeTrackingId: $timeTrackingId, status: $status) {
      isSuccess
      message
    }
  }
`;

export default DELETE_ALL_TIME_LOG;
