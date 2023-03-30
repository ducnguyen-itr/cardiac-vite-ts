import gql from 'graphql-tag';

const EVENT_LOGS = gql`
  query eventLogs($filter: EventLogFilter, $limit: Int) {
    eventLogs(filter: $filter, limit: $limit) {
      _id
      oldProperties
      newProperties
      comment
      type
      loggedBy {
        _id
        firstName
        lastName
        photo
        roles
      }
      createdAt
    }
  }
`;

export default EVENT_LOGS;
