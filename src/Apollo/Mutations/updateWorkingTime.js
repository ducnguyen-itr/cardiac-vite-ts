import gql from 'graphql-tag';

const UPDATE_WORKING_TIME = gql`
  mutation updateWorkingTime($workingTime: WorkingTimeInput!) {
    updateWorkingTime(workingTime: $workingTime) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_WORKING_TIME;
