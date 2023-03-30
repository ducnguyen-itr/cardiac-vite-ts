import gql from 'graphql-tag';

const EVENT_LOG = gql`
  query eventLog($_id: ID!) {
    eventLog(_id: $_id) {
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
      }
      createdAt
    }
  }
`;

export default EVENT_LOG;
