import gql from 'graphql-tag';

const TIME_LOGS_QUERY = gql`
  query timeLogs($filter: TimeLogFilterInput!, $limit: Int) {
    timeLogs(filter: $filter, limit: $limit) {
      cursor
      timeLogs {
        _id
        carePlan {
          _id
        }
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
      }
    }
  }
`;

export default TIME_LOGS_QUERY;
