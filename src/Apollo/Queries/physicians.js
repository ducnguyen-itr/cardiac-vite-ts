import gql from 'graphql-tag';

const PHYSICIANS_QUERY = gql`
  query Bioflux0physicians($filter: Bioflux0PhysicianFilter, $limit: Int) {
    Bioflux0physicians(filter: $filter, limit: $limit) {
      id
      firstName
      lastName
    }
  }
`;

export default PHYSICIANS_QUERY;
