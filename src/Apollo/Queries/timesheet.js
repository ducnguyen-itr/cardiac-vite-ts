import gql from 'graphql-tag';

const TIME_SHEET = gql`
  query timesheet($_id: ID!) {
    timesheet(_id: $_id) {
      _id
      carePlan
      activity
      date
      duration
      participants {
        _id
          firstName
          lastName
      }
      notes
      isManual
      createdBy
      billable
    }
  }
`;

export default TIME_SHEET;
