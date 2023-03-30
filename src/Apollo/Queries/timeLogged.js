import gql from 'graphql-tag';

const TIME_LOGGED_QUERY = gql`
  query timeLogged($filter: TimeLoggedFilterInput!) {
    timeLogged(filter: $filter) 
  }
`;

export default TIME_LOGGED_QUERY;
