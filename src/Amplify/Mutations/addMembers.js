import gql from 'graphql-tag';

const ADD_MEMBERS = gql`
  mutation addMembers($input: AddMembersInput!) {
    addMembers(input: $input) {
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

export default ADD_MEMBERS;
