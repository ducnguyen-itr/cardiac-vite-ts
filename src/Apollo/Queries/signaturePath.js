import gql from 'graphql-tag';

const SIGNATURE_PATH_QUERY = gql`
  query user($_id: ID) {
    user(_id: $_id) {
      _id
      signature
    }
  }
`;

export default SIGNATURE_PATH_QUERY;
