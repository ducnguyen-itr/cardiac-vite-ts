import gql from 'graphql-tag';

const CALENDAR_CLINIC_CREATE_APPOINTMENT = gql`
  mutation clinicCreateAppointment($input: ClinicCreateAppointment!) {
    clinicCreateAppointment(input: $input) {
      isSuccess
      message
    }
  }
`;

export default CALENDAR_CLINIC_CREATE_APPOINTMENT;
