import gql from 'graphql-tag';

const CALENDAR_0_NON_CCM_PATIENTS = gql`
  query nonCCMPatients($filter: NonCCMPatientsFilter!, $limit: Int, $cursor: String) {
    nonCCMPatients(filter: $filter, limit: $limit, cursor: $cursor) {
      nonCCMPatients {
        _id
        firstName
        lastName
        photo
        roles
        available
        email
        gender
        dateOfBirth
        contact {
          phone1
          country
        }
        willDeletedAt
      }
      cursor
    }
  }
`;

export default CALENDAR_0_NON_CCM_PATIENTS;
