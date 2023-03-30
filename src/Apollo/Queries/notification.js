import gql from 'graphql-tag';
import NOTIFICATION_FRAGMENT from '../Fragments/notification';

const NOTIFICATION = gql`
  query notification($_id: ID!) {
    notification(_id: $_id) {
      ...${NOTIFICATION_FRAGMENT}
    }
  }
`;

export default NOTIFICATION;
