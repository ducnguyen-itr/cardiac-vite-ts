import gql from 'graphql-tag';
import { CONTACT, FACILITY, INFO_INSURANCE } from '../Fragments/patient';
import { ID_NAME, ID_NAME_PHOTO } from '../Fragments/user';

const PATIENT_DEFAULT = gql`
  query patient($_id: ID, $email: String) {
    patient(_id: $_id, email: $email) {
      ...${ID_NAME}
      email
      contact {
        ...${CONTACT}
      }
      settings{
        isMetric
      }
      dateOfBirth
      height
      weight
      patientInfo {
        ...${INFO_INSURANCE}
      }
      gender
      currentCarePlan {
        _id
        facility {
          _id
          name
        }
        status
      }
    }
  }
`;

const PATIENT_APPOINTMENT = gql`
  query patient($_id: ID, $email: String) {
    patient(_id: $_id, email: $email) {
      ...${ID_NAME_PHOTO}
      gender
      dateOfBirth
      email
      currentCarePlan {
        _id
        facility{
          ...${FACILITY}
        }
        nurse {
          ...${ID_NAME_PHOTO}
        }
        physician {
          ...${ID_NAME_PHOTO}
        }
      }
    }
  }
`;

const PATIENT_PHOTO = gql`
  query patient($_id: ID, $email: String) {
    patient(_id: $_id, email: $email) {
      _id
      photo
    }
  }
`;
const PATIENT = (key = 0) => {
  switch (key) {
    case 1:
      return PATIENT_APPOINTMENT;
    case 2:
      return PATIENT_PHOTO;
    default:
      return PATIENT_DEFAULT;
  }
};
export default PATIENT;
