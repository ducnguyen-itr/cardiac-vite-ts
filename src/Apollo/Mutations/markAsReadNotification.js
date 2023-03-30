import gql from 'graphql-tag';

const MARK_AS_READ_NOTIFICATION = gql`
  mutation markAsReadNotification($_id: ID!, $facilityId: ID) {
    markAsReadNotification(_id: $_id, facilityId: $facilityId) {
      isSuccess
      message
    }
  }
`;

export default MARK_AS_READ_NOTIFICATION;
