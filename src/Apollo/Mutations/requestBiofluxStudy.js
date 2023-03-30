import gql from 'graphql-tag';

const REQUEST_BIOFLUX_STUDY = gql`
  mutation requestBiofluxStudy($input: BiofluxStudyInput) {
    requestBiofluxStudy(input: $input) {
      isSuccess
      message
      code
    }
  }
`;

export default REQUEST_BIOFLUX_STUDY;
