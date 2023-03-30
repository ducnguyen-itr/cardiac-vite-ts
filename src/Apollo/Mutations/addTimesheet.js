import gql from 'graphql-tag';

const ADD_TIME_SHEET = gql`
  mutation addTimesheet($input: TimesheetInput) {
    addTimesheet(input: $input) {
      isSuccess
      message
      timesheet {
        _id
      }
    }
  }
`;

export default ADD_TIME_SHEET;
