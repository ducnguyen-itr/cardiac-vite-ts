import gql from 'graphql-tag';
import { ATTENDEES } from '../Fragments/calendar';


const CHECK_EXISTENCE_APPOINTMENT = gql`
  query checkExistenceAppointment($date: DateTime!, $attendees: [ID!]!) {
    checkExistenceAppointment(date: $date, attendees: $attendees) {
      _id
      attendees {
        ...${ATTENDEES}
      }
      isCancel
    }
  }
`;

export default CHECK_EXISTENCE_APPOINTMENT;
