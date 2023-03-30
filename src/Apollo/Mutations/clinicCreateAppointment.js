import gql from 'graphql-tag';

const CALENDER_CLINIC_CREATE_APPOINTMENT = gql`
  mutation clinicCreateAppointment($input: ClinicCreateAppointment!) {
    clinicCreateAppointment(input: $input) {
      isSuccess
      message
    }
  }
`;
export default CALENDER_CLINIC_CREATE_APPOINTMENT;
