import gql from 'graphql-tag';

const DELETE_AUTO_MESSAGE_MUTATION = gql`
  mutation deleteAutoMessage($_id: ID!) {
    deleteAutoMessage(_id: $_id) {
      isSuccess
      message
    }
  }
`;

export default DELETE_AUTO_MESSAGE_MUTATION;
