import gql from 'graphql-tag';

const ICD_CODE = gql`
  query icdCode($_id: ID!) {
    icdCode(_id: $_id) {
      _id
      code
      codeName
      codeNameDisplay
      valid
      shortDescription
      longDescription
      type
    }
  }
`;

export default ICD_CODE;
