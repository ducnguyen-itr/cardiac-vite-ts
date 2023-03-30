import gql from 'graphql-tag';

const ATTENDEES = gql`
  {
    _id
    photo
    roles
    firstName
    lastName
  }
`;

const APPOINTMENT_VIDEO = gql`
  query appointment($_id: ID) {
    appointment(_id: $_id) {
      date
      carePlan {
        _id
      }
      attendees {
        ...${ATTENDEES}
      }
      patient {
        ...${ATTENDEES}
      }
      lastTimesheet
    }
  }
`;

export default APPOINTMENT_VIDEO;
