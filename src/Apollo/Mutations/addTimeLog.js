import gql from 'graphql-tag';

const ADD_TIME_LOG = gql`
  mutation addTimeLog($input: AddTimeLogInput) {
    addTimeLog(input: $input) {
      isSuccess
      message
      timeLog {
        _id
      }
    }
  }
`;

export default ADD_TIME_LOG;
