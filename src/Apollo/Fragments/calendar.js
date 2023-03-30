import gql from 'graphql-tag';
import { FACILITY, FACILITY_NAME } from './patient';
import { ID_FULL_NAME, ID_NAME_PHOTO } from './user';

export const PATIENT = gql`
{
  ...${ID_NAME_PHOTO}
  email
  contact {
    phone1
  }
  gender
  dateOfBirth
}
`;

export const PATIENT_INFO = gql`
{
  ...${ID_FULL_NAME}
  email
  contact {
    phone1
  }
  gender
  dateOfBirth
}
`;

export const ATTENDEES = gql`
{
  ...${ID_NAME_PHOTO}
  roles
}
`;


export const ATTENDEES_APOINTMENT = gql`
{
  ...${ID_FULL_NAME}
  roles
}
`;

export const CARE_PLAN = gql`
{
  _id
  facility {
    ...${FACILITY}
  }
  physician {
    ...${ID_NAME_PHOTO}
  }
  nurse {
    ...${ID_NAME_PHOTO}
  }
  status
}
`;


export const APOINTMENT_CARE_PLAN = gql`
{
  _id
  friendlyId
  facility {
    ...${FACILITY_NAME}
  }
  physician {
    ...${ID_FULL_NAME}
  }
  nurse {
    ...${ID_FULL_NAME}
  }
  status
}
`;
