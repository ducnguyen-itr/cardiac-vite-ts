import gql from 'graphql-tag';

const ADD_PATIENT_BY_TECHNICIAN = gql`
  mutation addPatientByTechnician($profile: AddPatientByTechnicianInput!) {
    addPatientByTechnician(profile: $profile) {
      isSuccess
      message
    }
  }
`;
export default ADD_PATIENT_BY_TECHNICIAN;
