import gql from 'graphql-tag';

const PATIENT_INFO_MISSING = gql`
  query patientInfoMissing($carePlanId: ID!) {
    patientInfoMissing(carePlanId: $carePlanId) {
      isSuccess
      message
      missing
    }
  }
`;

export default PATIENT_INFO_MISSING;
