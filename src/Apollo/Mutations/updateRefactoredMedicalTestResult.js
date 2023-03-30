import gql from 'graphql-tag';

const MUTATE_UPDATE_REFACTORED_MEDICAL_TEST_RESULT = gql`
  mutation updateMedicalTestResult($_id: ID!, $input: UpdateMedicalTestResultInput!) {
    updateMedicalTestResult(_id: $_id, input: $input) {
      isSuccess
      message 
      medicalTestResult {
        _id
        type
        date
        summary
        title
      }
    }
  }
`;

export default MUTATE_UPDATE_REFACTORED_MEDICAL_TEST_RESULT;
