import gql from 'graphql-tag';

const QUERY_CONVERSATION = gql`
  query conversation($userId: ID!, $roomId: ID!) {
    conversation(userId: $userId, roomId: $roomId) {
      userId
      room {
        id
        name
      }
      mute
      pin
      hide
      markAsUnread
      lastMessage {
        content
      }
      createdAt
    }
  }
}
`;

export default QUERY_CONVERSATION;
