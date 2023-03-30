import gql from 'graphql-tag';

const MUTATION_ADD_REFACTORED_MEDICAL_TEST_RESULT = gql`
  mutation addMedicalTestResult($input: AddMedicalTestResultInput!) {
    addMedicalTestResult(input: $input) {
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

export default MUTATION_ADD_REFACTORED_MEDICAL_TEST_RESULT;
