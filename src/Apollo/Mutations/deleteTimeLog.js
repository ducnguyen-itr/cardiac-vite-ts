import gql from 'graphql-tag';

const DELETE_TIME_LOG = gql`
  mutation deleteTimeLog($_id: ID!) {
    deleteTimeLog(_id: $_id) {
      isSuccess
      message
    }
  }
`;

export default DELETE_TIME_LOG;
