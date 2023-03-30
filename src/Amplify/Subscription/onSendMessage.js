const ON_SEND_MESSAGE = /* GraphQL */ `
  subscription onSendMessage {
    onSendMessage {
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
      }
    }
  }
`;

export default ON_SEND_MESSAGE;
