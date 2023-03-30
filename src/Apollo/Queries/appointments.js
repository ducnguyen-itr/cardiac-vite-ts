import gql from 'graphql-tag';
import {
  APOINTMENT_CARE_PLAN, ATTENDEES_APOINTMENT, PATIENT_INFO,
} from '../Fragments/calendar';

const APPOINTMENTS = gql`
  query appointments($filter: AppointmentFilterInput, $limit: Int) {
    appointments(filter: $filter, limit: $limit) {
      _id
      scheduleType
      appointmentType
      date
      carePlan {
        ...${APOINTMENT_CARE_PLAN}
      }
      patient {
        ...${PATIENT_INFO}
      }
      attendees {
        ...${ATTENDEES_APOINTMENT}
      }
      isCancel
    }
  }
`;

export default APPOINTMENTS;
