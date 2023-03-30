import gql from 'graphql-tag';

const REMOVE_MEMBERS = gql`
  mutation removeMembers($input: RemoveMembersInput!) {
    removeMembers(input: $input) {
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

export default REMOVE_MEMBERS;
