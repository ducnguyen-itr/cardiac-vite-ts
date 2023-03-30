import gql from 'graphql-tag';

const TIME_SHEETS = gql`
  query timesheets($filter: TimesheetFilter!, $limit: Int) {
    timesheets(filter: $filter, limit: $limit) {
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

export default TIME_SHEETS;
