import gql from 'graphql-tag';

const UPDATE_TIME_LOG = gql`
  mutation updateTimeLog($_id: ID!, $input: UpdatedTimeLogInput!) {
    updateTimeLog(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_TIME_LOG;
