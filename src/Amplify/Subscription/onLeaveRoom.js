const ON_LEAVE_ROOM = /* GraphQL */ `
  subscription ON_LEAVE_ROOM {
    onLeaveRoom {
      isSuccess
      error
      userId
      room {
        id
        name
        memberIds
        membersRecord
        patientId
        createdById
        createdAt
      }
      memberIds
    }
  }
`;
export default ON_LEAVE_ROOM;
