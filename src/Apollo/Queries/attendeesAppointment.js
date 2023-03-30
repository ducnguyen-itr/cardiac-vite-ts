import gql from 'graphql-tag';
import { FACILITY } from '../Fragments/patient';
import { ID_NAME_PHOTO } from '../Fragments/user';

const ATTENDEES_APPOINTMENT = gql`
  query attendeesAppointment($filter: AttendeesAppointmentFilterInput!, $limit: Int) {
    attendeesAppointment(filter: $filter, limit: $limit) {
      ...${ID_NAME_PHOTO}
      roles
      title
      currentFacility {
        ...${FACILITY}
      }
      email
      facilities {
        _id
        name
      }
      availableAppointment
    }
  }
`;

export default ATTENDEES_APPOINTMENT;
