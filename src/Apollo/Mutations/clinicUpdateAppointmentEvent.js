import gql from 'graphql-tag';

const CALENDAR_CLINIC_UPDATE_APPOINTMENT = gql`
  mutation clinicUpdateAppointmentEvent($_id: ID!, $input: UpdateAppointmentEventInput!, $options: UpdateAppointmentOptionEnum) {
    clinicUpdateAppointmentEvent(_id: $_id, input: $input, options: $options) {
      isSuccess
      message
    }
  }
`;

export default CALENDAR_CLINIC_UPDATE_APPOINTMENT;
