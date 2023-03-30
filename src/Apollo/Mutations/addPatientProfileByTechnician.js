import gql from 'graphql-tag';

const ADD_PATIENT_PROFILE_BY_TECHNICIAN = gql`
  mutation addPatientProfileByTechnician($profile: PatientProfileInput!) {
    addPatientProfileByTechnician(profile: $profile) {
      isSuccess
      message
    }
  }
`;

export default ADD_PATIENT_PROFILE_BY_TECHNICIAN;
