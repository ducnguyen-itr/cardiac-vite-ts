import gql from 'graphql-tag';

const RESEND_PASSWORD = gql`
  mutation resendPassword($patientId: ID!) {
    resendPassword(patientId: $patientId) {
      temporaryPassword
      isSuccess
      message
    }
  }
`;

export default RESEND_PASSWORD;
