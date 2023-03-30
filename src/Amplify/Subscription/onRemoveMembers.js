
const ON_REMOVE_MEMBERS = /* GraphQL */ `
  subscription OnRemoveMembers {
    onRemoveMembers {
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

export default ON_REMOVE_MEMBERS;
