import gql from 'graphql-tag';

const UPDATE_MEDICAL_TEST_RESULT = gql`
  mutation updateMedicalTestResult($_id: ID!,$medicalTestResult: MedicalTestResultInput) {
    updateMedicalTestResult(_id: $_id, medicalTestResult: $medicalTestResult) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_MEDICAL_TEST_RESULT;
