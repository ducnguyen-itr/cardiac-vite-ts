import gql from 'graphql-tag';

const MESSAGES_INFO = gql`
query messages($userId: ID!, $roomId: ID!, $nextToken: String) {
  conversation(userId: $userId, roomId: $roomId) {
    messages(nextToken: $nextToken, sortDirection: DESC, limit: 50) {
      nextToken
      items {
        toRoomId
        fromUserId
        content
        type
        reactions {
          type
          reactedById
        }
        sharedFiles {
          items {
            id
            path
            thumbnail
            mimeType
          }
        }
        updatedAt
        createdAt
        deletedAt
      }
    }
  }
}
`;

const NEW_CONVERSATION_INFO = gql`
query messages($userId: ID!, $roomId: ID!, $nextToken: String) {
  conversation(userId: $userId, roomId: $roomId) {
    messages(nextToken: $nextToken, sortDirection: DESC, limit: 20) {
      nextToken
      items {
        toRoomId
        fromUserId
        content
        type
        reactions {
          type
          reactedById
        }
        sharedFiles {
          items {
            id
            path
            thumbnail
            mimeType
          }
        }
        updatedAt
        createdAt
        deletedAt
      }
    }
    room {
      id
      name
      membersRecord
      patientId
      createdById
      createdAt
      memberIds
    }
    lastMessageSent
      lastMessage {
        content
        deletedAt
      }
    unreadMessagesCount
    read
  }
}
`;

const QUERY_MESSAGES = (key = 0) => {
  switch (key) {
    case 1: {
      return NEW_CONVERSATION_INFO;
    }
    default: {
      return MESSAGES_INFO;
    }
  }
};

export default QUERY_MESSAGES;
