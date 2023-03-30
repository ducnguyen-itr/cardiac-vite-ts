import gql from 'graphql-tag';

const ATTENDEE_INFO_INROOM = gql`
  query user($appointmentId: ID!) {
    user(appointmentId: $appointmentId)
  }
`;

export default ATTENDEE_INFO_INROOM;
