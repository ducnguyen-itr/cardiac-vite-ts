import gql from 'graphql-tag';

const BIOFLUX_UPDATE_STUDY = gql`
  mutation Bioflux0updateStudy($studyId: ID!, $props: Bioflux0UpdateStudyInput!) {
    Bioflux0updateStudy(studyId: $studyId, props: $props) {
      isSuccess
      message
    }
  }
`;

export default BIOFLUX_UPDATE_STUDY;
