import gql from 'graphql-tag';

const ADD_PRESCRIPTION = gql`
  mutation addPrescription($input: PrescriptionInput!) {
    addPrescription(input: $input) {
      isSuccess
      message
    }
  }
`;

export default ADD_PRESCRIPTION;
