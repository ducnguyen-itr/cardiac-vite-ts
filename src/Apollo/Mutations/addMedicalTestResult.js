import gql from 'graphql-tag';

const ADD_MEDICAL_TEST_RESULT = gql`
  mutation addMedicalTestResult($medicalTestResult: MedicalTestResultInput!) {
    addMedicalTestResult(medicalTestResult: $medicalTestResult) {
      isSuccess
      message
    }
  }
`;

export default ADD_MEDICAL_TEST_RESULT;
