import gql from 'graphql-tag';

const TOTAL_DURATION_TIME_SHEET = gql`
  query totalDurationTimesheet($filter: TotalDurationTimesheetFilterInput!) {
    totalDurationTimesheet(filter: $filter) 
  }
`;

export default TOTAL_DURATION_TIME_SHEET;
