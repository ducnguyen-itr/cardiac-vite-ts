import gql from 'graphql-tag';

const LATEST_SERVICE_CODES = gql`
  query latestServiceCodes($filter: LatestServiceCodeFilterInput!, $limit: Int) {
    latestServiceCodes(filter: $filter, limit: $limit) {
      _id
      code
      description
    }
  }
`;

export default LATEST_SERVICE_CODES;
