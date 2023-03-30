import gql from 'graphql-tag';

const UPDATE_PATIENT_DEMOGRAPHIC = gql`
  mutation updatePatientDemographic($_id: ID!, $input: PatientDemographicInput!) {
    updatePatientDemographic(_id: $_id, input: $input) {
      isSuccess
      message
    }
  } 
`;

export default UPDATE_PATIENT_DEMOGRAPHIC;
