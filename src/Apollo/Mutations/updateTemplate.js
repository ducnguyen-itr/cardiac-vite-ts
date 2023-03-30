import gql from 'graphql-tag';

const UPDATE_TEMPLATE_MUTATION = gql`
  mutation updateTemplate($_id: ID!, $input: UpdateTemplateInput!) {
    updateTemplate(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_TEMPLATE_MUTATION;
