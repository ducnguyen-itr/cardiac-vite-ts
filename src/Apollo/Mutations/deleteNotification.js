import gql from 'graphql-tag';

const DELETE_NOTIFICATION = gql`
  mutation deleteNotification($_id: ID!, $facilityId: ID) {
    deleteNotification(_id: $_id, facilityId: $facilityId) {
      isSuccess
      message
    }
  }
`;

export default DELETE_NOTIFICATION;
