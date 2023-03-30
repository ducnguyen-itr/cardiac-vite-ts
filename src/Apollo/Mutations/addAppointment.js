import gql from 'graphql-tag';

const ADĐ_APPOINTMENT = gql`
  mutation addAppointment($input: AppointmentInput!) {
    addAppointment(input: $input) {
      isSuccess
      message
    }
  }
`;

export default ADĐ_APPOINTMENT;
