import gql from 'graphql-tag';

const QUERY_LIST_CONVERSATION = gql`
query conversations($filter: ConversationsFilterInput, $cursor: String, $limit: Int) {
  conversations(filter: $filter, cursor: $cursor, limit: $limit) {
    nextToken
    isSuccess
    error
    conversations {
      userId
      read
      pin
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
      messages(limit: 20, sortDirection: DESC) {
        nextToken
        items {
          type
          toRoomId
          fromUserId
          content
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
}
`;

export default QUERY_LIST_CONVERSATION;
