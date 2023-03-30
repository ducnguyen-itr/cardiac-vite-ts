import gql from 'graphql-tag';

const CALENDAR_AVAILABLE_CLINIC_USERS = gql`
  query availableClinicUsers($filter: AvailableClinicUsersFilter!) {
    availableClinicUsers(filter: $filter) {
      isSuccess
      message
      users {
        _id
        firstName
        available
        lastName
        photo
        roles
        available
      }
    }
  }
`;

export default CALENDAR_AVAILABLE_CLINIC_USERS;
