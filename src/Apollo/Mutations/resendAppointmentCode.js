import gql from 'graphql-tag';

const RESEND_APPOINTMENT_CODE = gql`
  mutation resendAppointmentCode($_id: ID!) {
    resendAppointmentCode(_id: $_id) {
      isSuccess
      message
    }
  }
`;

export default RESEND_APPOINTMENT_CODE;
