import gql from 'graphql-tag';

const ADD_TEMPLATE_MESSAGE_MUTATION = gql`
  mutation addTemplateMessage($input: AddTemplateMessageInput!) {
    addTemplateMessage(input: $input) {
      isSuccess
      message
      templateMessage {
        _id
        body
        createdBy
        createdAt
      }
    }
  }
`;

export default ADD_TEMPLATE_MESSAGE_MUTATION;
