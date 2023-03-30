const ON_DELETE_MESSAGE = /* GraphQL */ `
  subscription onDeleteMessage {
    onDeleteMessage {
      isSuccess
      error
      memberIds
      messageCreatedAt
      roomId
      userId
    }
  }
`;

export default ON_DELETE_MESSAGE;
