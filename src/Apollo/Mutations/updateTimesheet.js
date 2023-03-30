import gql from 'graphql-tag';

const UPDATE_TIME_SHEET = gql`
  mutation updateTimesheet($_id: ID!, $input: UpdatedTimesheetInput!) {
    updateTimesheet(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_TIME_SHEET;
