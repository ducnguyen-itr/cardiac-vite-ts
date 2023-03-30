import gql from 'graphql-tag';

const UPDATE_FOLLOW_UP = gql`
  mutation updateFollowUp($_id: ID!, $isDone: Boolean!) {
    updateFollowUp(_id: $_id, isDone: $isDone) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_FOLLOW_UP;
