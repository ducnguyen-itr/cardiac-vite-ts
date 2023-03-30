import gql from 'graphql-tag';
import { ID_FULL_NAME, ID_NAME_PHOTO } from './user';

export const INFO_INSURANCE = gql`
{
  insuranceName
  insuranceType
  insuranceExpireDate
  insuranceProvincialBilling
}
`;

export const CONTACT = gql`
{
  phone1
  country
  address
  city
  state
  zip
}
`;

export const SF_36_RESULT = gql`
  {
    _id
    physicalFunc
    limitPhysical
    limitEmotional
    energyFatigue
    socialFunc
    generalHealth
    date
    sf36Questions {
      question
      answer
    }
  }
`;

export const SYMPTOM_HISTORY_FRAGMENT = gql`
  {
    lightHeadedness
    fatigue
    decreasingExerciseCapacity
    dyspnea
    syncope
    palpitations
    chestPainTimePerWeek
    increasingFrequencyOfChestPain
    numberInArmOrLeg
    painfulUrination
  }
`;

export const PATIENT_EMAIL_PHONE = gql`
  {
    ...${ID_NAME_PHOTO}
    email
    contact {
      phone1
    }
    willDeletedAt
  }
`;

export const PATIENT_EMAIL_PHONE_NAME = gql`
  {
    ...${ID_FULL_NAME}
    email
    contact {
      phone1
    }
  }
`;


export const PATIENT_EMAIL_NAME = gql`
  {
    ...${ID_FULL_NAME}
    email
  }
`;

export const PATIENT_NAME = gql`
  {
    ...${ID_NAME_PHOTO}
    email
    willDeletedAt
  }
`;

export const PATIENT_FACILITY_NAME = gql`
{
  ...${ID_FULL_NAME}
  email
  currentFacility {
    name
  }
}
`;

export const PATIENT_INFO = gql`
  {
    ...${ID_NAME_PHOTO}
    email
    contact {
      ...${CONTACT}
    }
    dateOfBirth
    height
    weight
    gender
    currentFacility {
      name
    }
    patientInfo {
      ...${INFO_INSURANCE}
    }
    settings {
      isMetric
    }
    willDeletedAt
  }
`;

export const PATIENT_INFO_DETAIL_FRAGMENT = gql`
  {
    ...${ID_NAME_PHOTO}
    email
    contact {
      ...${CONTACT}
    }
    dateOfBirth
    height
    weight
    settings {
      isMetric
    }
    patientInfo {
      ...${INFO_INSURANCE}
    }
    gender
    willDeletedAt
  }
`;

export const FACILITY = gql`
{
  _id
  name
  canUseBiofluxDirect
  contact {
    ...${CONTACT}
  }
}
`;

export const FACILITY_NAME = gql`
{
  _id
  name
}
`;

// sf36Result {
//   ...${sf36Result}
// }

export const BIOFLUX = gql`
{
  studyId
  facilityName
  reportPath
  technicianComment
}
`;

export const MEDICAL_HISTORY = gql`
{
  type
  other
  date
}
`;


export const GENERAL_INFO = gql`
{
  firstName
  lastName
  dateOfBirth
  height
  weight
  gender
}
`;

export const SETTING = gql`
{
  isMetric
}
`;

export const AFIB_HISTORY = gql`
{
  hadCardioversion
  electricalShock
  symptomHistory {
    ...${SYMPTOM_HISTORY_FRAGMENT}
  }
  isHospitalized
  hospitalizedDate
 
}
`;


export const AFIB_HISTORY_TEMPLATE = gql`
{
  hadCardioversion
  electricalShock
  symptomHistory {
    ...${SYMPTOM_HISTORY_FRAGMENT}
  }
  isHospitalized
}
`;

export const PATIENT = gql`
{
  _id
  roles
  facility {
    ...${FACILITY}
  }
  patientId
  email
  contact {
    ...${CONTACT}
  }
  settings {
    ...${SETTING}
  }
  patientInfo {
    ...${INFO_INSURANCE}
  }
  ...${GENERAL_INFO}
  currentCarePlan {
    _id
  }
  sf36Result {
    ...${SF_36_RESULT}
  }
  photo
}
`;
