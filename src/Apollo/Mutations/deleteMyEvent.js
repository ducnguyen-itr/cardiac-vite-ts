import gql from 'graphql-tag';

const CALENDAR_DELETE_MY_EVENTS = gql`
  mutation deleteMyEvent($_id: ID!) {
    deleteMyEvent(_id: $_id) {
      isSuccess
      message
    }
  }
`;

export default CALENDAR_DELETE_MY_EVENTS;
