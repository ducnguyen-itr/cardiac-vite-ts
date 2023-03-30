import gql from 'graphql-tag';

const BIOFLUX_CREATE_STUDY = gql`
  mutation Bioflux0createStudy($input: Bioflux0StudyInfoInput) {
    Bioflux0createStudy(input: $input) {
      isSuccess
      message
    }
  }
`;

export default BIOFLUX_CREATE_STUDY;
