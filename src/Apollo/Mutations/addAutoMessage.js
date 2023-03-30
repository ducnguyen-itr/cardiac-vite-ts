import gql from 'graphql-tag';
import AUTO_MESSAGE_FRAGMENT from '../Fragments/autoMessage';

const ADD_AUTO_MESSAGE_MUTATION = gql`
  mutation addAutoMessage($input: AddAutoMessageInput!) {
    addAutoMessage(input: $input) {
      isSuccess
      message
      autoMessage {
        ...${AUTO_MESSAGE_FRAGMENT}
      }
    }
  }
`;

export default ADD_AUTO_MESSAGE_MUTATION;
