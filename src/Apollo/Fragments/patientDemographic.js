import gql from 'graphql-tag';
import { CONTACT } from './patient';

const PATIENT_DEMOGRAPHIC = gql`
{
  firstName
  lastName
  gender
  dateOfBirth
  height
  weight
  contactMethod
  contact {
    phone1
    emergencyPhone
    homePhone
    country
    address
    city
    state
    zip
  }
  email
  contactMethod
  patientInfo {
    insuranceType
    insuranceName
    insuranceExpireDate
    insuranceProvincialBilling
  }
}
`;
export const PATIENT_DEMOGRAPHIC_NAME = gql`
  {
    firstName
    lastName  
  }
`;

export const PATIENT_DEMOGRAPHIC_NAME_EMAIL = gql`
  {
    firstName
    lastName
    email
  }
`;

export default PATIENT_DEMOGRAPHIC;
