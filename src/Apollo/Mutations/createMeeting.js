import gql from 'graphql-tag';

const CREATE_MEETING = gql`
  mutation createMeeting($appointmentId: ID!) {
    createMeeting(appointmentId: $appointmentId) {
      isSuccess
      message
      room
    }
  }
`;

export default CREATE_MEETING;
