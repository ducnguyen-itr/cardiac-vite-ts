import gql from 'graphql-tag';
import AUTO_MESSAGE_FRAGMENT from '../Fragments/autoMessage';

const AUTO_MESSAGES_QUERY = gql`
  query autoMessages($filter: AutoMessageFilterInput!, $limit: Int) {
    autoMessages(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor 
      autoMessages {
        ...${AUTO_MESSAGE_FRAGMENT}
      }
    }
  }
`;

export default AUTO_MESSAGES_QUERY;
