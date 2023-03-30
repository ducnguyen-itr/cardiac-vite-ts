import gql from 'graphql-tag';

const ICD_CODES = gql`
  query icdCodes($filter: ICDCodeFilterInput!, $pagination: PaginationInput) {
    icdCodes(filter: $filter, pagination: $pagination) {
      isSuccess
      message
      cursor
      icdCodes {
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
  }
`;

export default ICD_CODES;
