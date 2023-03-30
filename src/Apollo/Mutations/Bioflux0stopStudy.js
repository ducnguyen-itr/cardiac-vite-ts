import gql from 'graphql-tag';

const BIOFLUX_STOP_STUDY = gql`
  mutation Bioflux0stopStudy($studyFid: Int!) {
    Bioflux0stopStudy(studyFid: $studyFid) {
      isSuccess
      message
    }
  }
`;

export default BIOFLUX_STOP_STUDY;
