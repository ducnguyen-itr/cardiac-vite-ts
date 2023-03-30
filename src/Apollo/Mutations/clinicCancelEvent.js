import gql from 'graphql-tag';

const CALENDAR_CLINIC_CANCEL_EVENTS = gql`
  mutation clinicCancelEvent($_id: ID!, $options: ClinicCancelEventEnum) {
    clinicCancelEvent(_id: $_id, options: $options) {
      isSuccess
      message
    }
  }
`;

export default CALENDAR_CLINIC_CANCEL_EVENTS;
