import gql from 'graphql-tag';

const DELETE_ALL_NOTIFICATION = gql`
  mutation deleteAllNotification($facilityId: ID) {
    deleteAllNotification(facilityId: $facilityId) {
      isSuccess
      message
    }
  }
`;

export default DELETE_ALL_NOTIFICATION;
