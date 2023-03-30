
import gql from 'graphql-tag';

const UPDATE_CONVERSATION = gql`
mutation updateConversation($input: UpdateConversationInput!) {
  updateConversation(input: $input) {
    isSuccess
    error
    conversation {
      pin
      updatedAt
    }
  }
}
`;

export default UPDATE_CONVERSATION;
