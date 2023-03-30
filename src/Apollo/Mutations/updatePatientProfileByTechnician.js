import gql from 'graphql-tag';

const UPDATE_PATIENT_PROFILE_BY_TECHNICIAN = gql`
  mutation updatePatientProfileByTechnician($patientId: ID!, $isNewCarePlan: Boolean!, $profile: PatientProfileInput!) {
    updatePatientProfileByTechnician(patientId:$patientId, isNewCarePlan: $isNewCarePlan,profile: $profile) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_PATIENT_PROFILE_BY_TECHNICIAN;
