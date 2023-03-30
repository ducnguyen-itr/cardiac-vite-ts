import gql from 'graphql-tag';

const UNREAD_CONVERSATIONS_COUNT = gql`
query unreadConversationsCount {
  unreadConversationsCount {
    isSuccess
    count
  }
}
`;

export default UNREAD_CONVERSATIONS_COUNT;
