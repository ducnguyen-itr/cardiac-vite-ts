import gql from 'graphql-tag';

const ADD_TEMPLATE_MUTATION = gql`
  mutation addTemplate($input: AddTemplateInput!) {
    addTemplate(input: $input) {
      isSuccess
      message
    }
  }
`;

export default ADD_TEMPLATE_MUTATION;
