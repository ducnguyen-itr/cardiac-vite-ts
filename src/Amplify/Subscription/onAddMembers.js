const ON_ADD_MEMBERS = /* GraphQL */ `
  subscription OnAddMembers {
    onAddMembers {
      isSuccess
      error
      userId
      room {
        id
        name
        memberIds
        membersRecord
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

export default ON_ADD_MEMBERS;
