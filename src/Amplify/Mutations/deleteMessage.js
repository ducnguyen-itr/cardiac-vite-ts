import gql from 'graphql-tag';

const DELETE_MESSAGE = gql`
  mutation deleteMessage($roomId: ID!, $createdAt: AWSDateTime!) {
    deleteMessage(roomId: $roomId, createdAt: $createdAt) {
      isSuccess
      error
      memberIds
      messageCreatedAt
      roomId
      userId
    }
  }
`;

export default DELETE_MESSAGE;
