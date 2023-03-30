import gql from 'graphql-tag';

const LEAVE_ROOM = gql`
  mutation leaveRoom($roomId: ID!) {
    leaveRoom(roomId: $roomId) {
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

export default LEAVE_ROOM;
