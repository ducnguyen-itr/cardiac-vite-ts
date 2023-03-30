import gql from 'graphql-tag';

const CALENDAR_AVAILABLE_CLINIC_USER = gql`
  query availableClinicUsers($filter: AvailableClinicUsersFilter!) {
    availableClinicUsers(filter: $filter) {
      isSuccess
      message
      users {
        _id
        firstName
        lastName
        photo
        available
        email
        gender
        dateOfBirth
      }
    }
  }
`;

export default CALENDAR_AVAILABLE_CLINIC_USER;
