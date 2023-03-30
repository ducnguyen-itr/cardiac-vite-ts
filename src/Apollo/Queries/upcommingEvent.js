import gql from 'graphql-tag';

const CALENDAR_UPCOMING_EVENTS = gql`
  query upcommingEvent($filter: UpcommingEventFilter!) {
    upcommingEvent(filter: $filter) {
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

export default CALENDAR_UPCOMING_EVENTS;
