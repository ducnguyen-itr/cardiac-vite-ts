import gql from 'graphql-tag';

const UPDATE_MESSAGE = gql`
  mutation updateMessage($input: UpdateMessageInput!) {
    updateMessage(input: $input) {
      isSuccess
      error
      message {
        toRoomId
        content
        searchableContent
        createdAt
        updatedAt
      }
    }
  }
`;

export default UPDATE_MESSAGE;
