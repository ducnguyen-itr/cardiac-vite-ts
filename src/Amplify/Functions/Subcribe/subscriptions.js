/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom {
    onUpdateRoom {
      isSuccess
      error
      userId
      room {
        id
        name
        memberIds
        patientId
        hash
        createdById
        updatedAt
        createdAt
      }
      memberIds
    }
  }
`;
export const onAddMembers = /* GraphQL */ `
  subscription OnAddMembers {
    onAddMembers {
      isSuccess
      error
      userId
      room {
        id
        name
        memberIds
        patientId
        hash
        createdById
        updatedAt
        createdAt
      }
      memberIds
    }
  }
`;
export const onRemoveMembers = /* GraphQL */ `
  subscription OnRemoveMembers {
    onRemoveMembers {
      isSuccess
      error
      userId
      room {
        id
        name
        memberIds
        patientId
        hash
        createdById
        updatedAt
        createdAt
      }
      memberIds
    }
  }
`;
export const onLeaveRoom = /* GraphQL */ `
  subscription OnLeaveRoom {
    onLeaveRoom {
      isSuccess
      error
      userId
      room {
        id
        name
        memberIds
        patientId
        hash
        createdById
        updatedAt
        createdAt
      }
      memberIds
    }
  }
`;
export const onSendMessage = /* GraphQL */ `
  subscription OnSendMessage {
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
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage {
    onUpdateMessage {
      isSuccess
      error
      userId
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
      memberIds
    }
  }
`;
export const onReactMessage = /* GraphQL */ `
  subscription OnReactMessage {
    onReactMessage {
      isSuccess
      error
      userId
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
      memberIds
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage {
    onDeleteMessage {
      isSuccess
      error
      userId
      roomId
      messageCreatedAt
      memberIds
    }
  }
`;
export const onTyping = /* GraphQL */ `
  subscription OnTyping {
    onTyping {
      isSuccess
      error
      userId
      roomId
      memberIds
    }
  }
`;
