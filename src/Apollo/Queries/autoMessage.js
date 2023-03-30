import gql from 'graphql-tag';
import AUTO_MESSAGE_FRAGMENT from '../Fragments/autoMessage';

const AUTO_MESSAGE_QUERY = gql`
  query autoMessage($_id: ID!) {
    autoMessage(_id: $_id) {
      ...${AUTO_MESSAGE_FRAGMENT}
    }
  }
`;

export default AUTO_MESSAGE_QUERY;
