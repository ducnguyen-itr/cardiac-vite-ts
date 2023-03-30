import gql from 'graphql-tag';
import AUTO_MESSAGE_FRAGMENT from '../Fragments/autoMessage';

const UDPATE_AUTO_MESSAGE_MUTATION = gql`
  mutation updateAutoMessage($_id: ID!, $input: UpdateAutoMessageInput!) {
    updateAutoMessage(_id: $_id, input: $input) {
      isSuccess
      message
      autoMessage {
        ...${AUTO_MESSAGE_FRAGMENT}
      }
    }
  }
`;

export default UDPATE_AUTO_MESSAGE_MUTATION;
