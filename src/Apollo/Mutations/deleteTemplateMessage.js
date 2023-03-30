import gql from 'graphql-tag';

const DELETE_TEMPLATE_MESSAGE_MUTATION = gql`
  mutation deleteTemplateMessage($_id: ID!) {
    deleteTemplateMessage(_id: $_id) {
      isSuccess
      message
    }
  }
`;

export default DELETE_TEMPLATE_MESSAGE_MUTATION;
