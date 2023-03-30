import gql from 'graphql-tag';
import { CARE_PLAN, PATIENT, ATTENDEES } from '../Fragments/calendar';

const APPOINTMENT = gql`
  query appointment($_id: ID) {
    appointment(_id: $_id) {
      _id
      scheduleType
      appointmentType
      date
      carePlan {
        ...${CARE_PLAN}
      }
      patient {
        ...${PATIENT}
      }
      attendees {
        ...${ATTENDEES}
      }
      isCancel
    }
  }
`;

export default APPOINTMENT;
