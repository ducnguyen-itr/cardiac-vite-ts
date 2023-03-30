import gql from 'graphql-tag';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';

const CALENDAR_EVENT = gql`
  query event($_id: ID!) {
    event(_id: $_id) {
      _id
      fromTime
      toTime
      status
      appointmentType
      type
      invitedPatientInfo {
        firstName
        lastName
      }
      call {
        _id
        chimeMeetingId
        callStatus
      }
      carePlan {
        _id
        friendlyId
        programType
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        physician {
          _id
          firstName
          lastName
        }
        nurse {
          _id
          firstName
          lastName
        }
        status
        allergies
      }
      patient {
        _id
        firstName
        lastName
        photo
        roles
        available
        email
        gender
        height
        weight
        dateOfBirth
        contact {
          address
          city
          state
          country
          phone1
          zip
        }
        willDeletedAt
        patientInfo {
          allergies
          insuranceName
          insuranceType
          medicalConditions 
        }
      }
      info {
        reasons
        symptom
        condition {
          reason
          meta {
            question
            answer
          }
        }
        medication {
          name
          dosages
          frequency
          timeToTake
          note
          unit
        }
        vital {
          systolic
          diastolic
          heartRate
          heartRhythm
          oxygenSaturation
          respiratoryRate
          temperature
          temperatureUnit
          weight
          weightUnit
          bmi
        }
        note
        patientNote
        medicalConditions
        allergies
      }
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
      patient {
        firstName
        lastName
        photo
        gender
        dateOfBirth
      }
      createdAt
      facility {
        _id
        name
        contact {
          address
          city
          state
          zip
          country
          phone1
          fax
        }
      }
      recurringId
    }
  }
`;

const CALENDAR_EVENT_BASIC_INFO = gql`
  query event($_id: ID!) {
    event(_id: $_id) {
      _id
      fromTime
      toTime
      status
      appointmentType
      type
      invitedPatientInfo {
        firstName
        lastName
      }
      call {
        _id
        callStatus
      }
      carePlan {
        _id
        friendlyId
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        physician {
          _id
        }
        nurse {
          _id
        }
        status
        programType
      }
      patient {
        _id
        firstName
        lastName
        photo
        gender
        dateOfBirth
        contact {
          address
          city
          state
          country
          phone1
          zip
        }
      } 
      info {
        reasons
      }
      attendees {
        user {
          _id
          firstName
          lastName
          photo
          roles
        }
        type
      }
      patient {
        firstName
        lastName
        photo
        gender
        dateOfBirth
      }
      facility {
        _id
        name
      }
      recurringId
      recurringDay
    }
  }
`;


const CALENDAR_EVENT_TIME_INFO = gql`
  query event($_id: ID!) {
    event(_id: $_id) {
      _id
      fromTime
      toTime
    }
  }
`;

const EVENT_PATIENT_INFO = gql`
  query event($_id: ID!) {
    event(_id: $_id) {
      _id
      invitedPatientInfo {
        firstName
        lastName
        country
        phone
        email
      }
      patient {
        _id
        firstName
        lastName
        photo
        roles
        available
        email
        gender
        height
        weight
        dateOfBirth
        contact {
          address
          city
          state
          country
          phone1
          zip
        }
        willDeletedAt
        patientInfo {
          allergies
          insuranceName
          insuranceType
          medicalConditions 
        }
      }
      facility {
        _id
        name
        contact {
          address
          city
          state
          zip
          country
          phone1
          fax
        }
      }
    }
  }
`;

const CALENDAR_EVENT_EXTEND_INFO = gql`
  query event($_id: ID!) {
    event(_id: $_id) {
      _id
        fromTime
        toTime
        status
        appointmentType
        type
        invitedPatientInfo {
          firstName
          lastName
        }
        call {
          _id
          callStatus
        }
        carePlan {
          _id
          friendlyId
          status
          patientDemographic {
            firstName
            lastName
          }
        }
        patient {
          _id
          firstName
          lastName
        }
        attendees {
          user {
            _id
            firstName
            lastName
          }
          type
        }
        facility {
          _id
          name
        }
        createdAt
        scheduleType
        facility {
          _id
          name
        }
        recurringId
    }
  }
`;


const CALENDAR_EVENT_LIST = gql`
  query event($_id: ID!) {
    event(_id: $_id) {
      _id
      fromTime
      toTime
      status
      appointmentType
      type
      invitedPatientInfo {
        firstName
        lastName
      }
      carePlan {
        _id
        friendlyId
        patientDemographic {
          firstName
          lastName
        }
        patient {
          _id
          firstName
          lastName
          willDeletedAt
        }
      }
      patient {
        _id
        firstName
        lastName
        willDeletedAt
      }
      attendees {
        user {
          _id
          firstName
          lastName
        }
        type
      }
      info {
        reasons
        symptom
      }
      createdAt
      scheduleType
      facility {
        _id
        name
      }
      recurringId
      call {
        _id
        callStatus
      }
    }
  }
`;


const CALENDAR_EVENT_QUERY = (key = 0) => {
  switch (key) {
    case 0: {
      return CALENDAR_EVENT;
    }
    case 1: {
      return CALENDAR_EVENT_TIME_INFO;
    }
    case 2: {
      return CALENDAR_EVENT_BASIC_INFO;
    }
    case 3: {
      return EVENT_PATIENT_INFO;
    }
    case 4: {
      return CALENDAR_EVENT_EXTEND_INFO;
    }
    case 5: {
      return CALENDAR_EVENT_LIST;
    }
    default: {
      return CALENDAR_EVENT;
    }
  }
};

export default CALENDAR_EVENT_QUERY;
