import gql from 'graphql-tag';

const BIOFLUX_0_SEND_STUDY_REFERENCE_CODE = gql`
  mutation Bioflux0sendStudyReferenceCode($studyId: ID!) {
    Bioflux0sendStudyReferenceCode(studyId: $studyId) {
      isSuccess
      message
    }
  }
`;

export default BIOFLUX_0_SEND_STUDY_REFERENCE_CODE;
