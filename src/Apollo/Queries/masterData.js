import gql from 'graphql-tag';

const MASTER_DATA = gql`
  query masterData($code: String!) {
    masterData(code: $code) {
      value
    }
  }
`;

export default MASTER_DATA;
