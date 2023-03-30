import gql from 'graphql-tag';

const END_MEETING = gql`
  mutation endMeeting($appointmentId: ID!) {
    endMeeting(appointmentId: $appointmentId) {
      isSuccess
      message
    }
  }
`;

export default END_MEETING;
