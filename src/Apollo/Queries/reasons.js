import gql from 'graphql-tag';

const REASONS = gql`
  query reasons($status: String) {
    reasons(status: $status) {
      _id
      name
      symptoms
      status
    }
  }
`;

export default REASONS;
