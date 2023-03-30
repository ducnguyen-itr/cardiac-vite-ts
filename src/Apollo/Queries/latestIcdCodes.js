import gql from 'graphql-tag';

const LATEST_ICD_CODES = gql`
  query latestIcdCodes($filter: LatestICDCodeFilterInput!, $limit: Int) {
    latestIcdCodes(filter: $filter, limit: $limit) {
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

export default LATEST_ICD_CODES;
