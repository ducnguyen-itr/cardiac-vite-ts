import gql from 'graphql-tag';

const TIME_LOG_QUERY = gql`
  query timeLog($_id: ID!) {
    timeLog(_id: $_id) {
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
`;

export default TIME_LOG_QUERY;
