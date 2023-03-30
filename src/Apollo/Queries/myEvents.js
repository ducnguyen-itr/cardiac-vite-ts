import gql from 'graphql-tag';

const CALENDAR_MY_EVENTS = gql`
  query myEvents($filter: MyEventsFilter!) {
    myEvents(filter: $filter) {
      _id
      fromTime
      toTime
      status
      appointmentType
      type
      attendees {
        user {
          _id
          firstName
          lastName
          photo
          roles
          available
        }
        type
        response
      }
      createdAt
      facility {
        _id
        name
      }
    }
  }
`;

export default CALENDAR_MY_EVENTS;
