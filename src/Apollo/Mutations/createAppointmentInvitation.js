import gql from 'graphql-tag';

const CREATE_APPOINTMENT_INVITATION = gql`
  mutation createAppointmentInvitation($input: CreateInvitationAppointmentInput!) {
    createAppointmentInvitation(input: $input) {
      isSuccess
      message
    }
  }
`;
export default CREATE_APPOINTMENT_INVITATION;
