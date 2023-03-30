import gql from 'graphql-tag';

const CALENDAR_BOOK_APPOINTMENT = gql`
  mutation bookAppointment($input: BookAppointmentInput!) {
    bookAppointment(input: $input) {
      isSuccess
      message
    }
  }
`;

export default CALENDAR_BOOK_APPOINTMENT;
