import gql from 'graphql-tag';

const DELETE_TEMPLATE_MUTATION = gql`
  mutation deleteTemplate($_id: ID!) {
    deleteTemplate(_id: $_id) {
      isSuccess
      message
    }
  }
`;

export default DELETE_TEMPLATE_MUTATION;
