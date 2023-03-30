import gql from 'graphql-tag';

const CALENDAR_CREATE_MY_EVENTS = gql`
  mutation createMyEvents($input: [CreateMyEventsInput]!) {
    createMyEvents(input: $input) {
      isSuccess
      message
    }
  }
`;

export default CALENDAR_CREATE_MY_EVENTS;
