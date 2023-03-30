import gql from 'graphql-tag';
import NOTIFICATION_FRAGMENT from '../Fragments/notification';

const NOTIFICATIONS_INFO = gql`
  query notifications($filter: NotificationFilterInput!, $limit: Int!) {
    notifications(filter: $filter, limit: $limit) {
      ...${NOTIFICATION_FRAGMENT}
    }
  }
`;

const NOTIFICATIONS_OVERVIEW = gql`
  query notifications($filter: NotificationFilterInput!, $limit: Int!) {
    notifications(filter: $filter, limit: $limit) {
      pushTime
      type
      body
    }
  }
`;

const NOTIFICATIONS = (key = 0) => {
  switch (key) {
    case 0:
      return NOTIFICATIONS_INFO;
    case 1:
      return NOTIFICATIONS_OVERVIEW;
    default:
      return NOTIFICATIONS_INFO;
  }
};

export default NOTIFICATIONS;
