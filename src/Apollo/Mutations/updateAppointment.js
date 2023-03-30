import gql from 'graphql-tag';

const UPDATE_APPOINTMENT = gql`
  mutation updateAppointment($_id: ID!, $input: UpdatedAppointmentInput) {
    updateAppointment(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_APPOINTMENT;
