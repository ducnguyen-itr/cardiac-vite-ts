import gql from 'graphql-tag';

const COUNT_NOTICATION_UNREAD = gql`
  query countNotificationUnRead($filter: CountNotificationUnReadFilterInput) {
    countNotificationUnRead(filter: $filter)
  }
`;

export default COUNT_NOTICATION_UNREAD;
