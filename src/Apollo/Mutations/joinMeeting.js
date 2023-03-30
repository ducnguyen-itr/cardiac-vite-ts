import gql from 'graphql-tag';

const JOIN_MEETING = gql`
  mutation joinMeeting($appointmentId: ID!) {
    joinMeeting(appointmentId: $appointmentId) {
      isSuccess
      message
      room
      attendee
      isNewRoom
    }
  }
`;

export default JOIN_MEETING;
