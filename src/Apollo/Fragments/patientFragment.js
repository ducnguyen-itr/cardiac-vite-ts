import gql from 'graphql-tag';

const PatientFragment = gql`
  {
    contact {
      address
      city
      state
      country
      zip
      phone1
      phone2
    }
    secondaryContact {
      name
      phone
      relationship
      email
    }
    patientId
    dob
    firstName
    middleName
    lastName
    gender
    email
  }
`;

export const PATIENT_FRAGMENT = gql`
  {
    patientId
    dob
    firstName
    middleName
    lastName
    gender
    email
  }
`;

export default PatientFragment;
