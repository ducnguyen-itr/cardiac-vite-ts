import gql from 'graphql-tag';
// import { CARE_PLAN, PATIENT, ATTENDEES } from '../Fragments/calendar';

const FOLLOW_UP_APPOINTMENT = gql`
  query appointment($_id: ID) {
    appointment(_id: $_id) {
      _id
      date
    }
  }
`;

export default FOLLOW_UP_APPOINTMENT;
