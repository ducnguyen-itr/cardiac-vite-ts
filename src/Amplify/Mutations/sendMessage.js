import gql from 'graphql-tag';

const SEND_MESSAGE = gql`
  mutation sendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      isSuccess
      error
      memberIds
      message {
        toRoomId
        fromUserId
        content
        type
        searchableContent
        isAutoMessage
        updatedAt
        createdAt
        deletedAt
        sharedFiles {
          items {
            id
            path
            thumbnail
            mimeType
          }
        }
      }
    }
  }
`;

export default SEND_MESSAGE;
