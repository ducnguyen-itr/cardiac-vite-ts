import gql from 'graphql-tag';

const ADĐ_BASELINE = gql`
  mutation addBaseline($input: AddBaselineInput!) {
    addBaseline(input: $input) {
      isSuccess
      message
    }
  }
`;

export default ADĐ_BASELINE;
