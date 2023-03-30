import gql from 'graphql-tag';

const MARK_AS_READ_CONVERSATION = gql`
  mutation markAsRead($roomId: ID!) {
    markAsRead(roomId: $roomId) {
      isSuccess
      error
      memberIds
    }
  }
`;

export default MARK_AS_READ_CONVERSATION;
