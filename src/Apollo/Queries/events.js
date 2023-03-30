import gql from 'graphql-tag';

const CALENDAR_EVENTS_INFO = gql`
query events($filter: EventFilter!, $limit: Int, $cursor: String, $orderType: OrderEnum) {
  events(filter: $filter, limit: $limit, cursor: $cursor, orderType: $orderType) {
    isSuccess
    message
    cursor
    events {
      _id
      fromTime
      toTime
      status
      appointmentType
      type
      carePlan {
        _id
        friendlyId
        patientDemographic {
          firstName
          lastName
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
        }
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
      info {
        reasons
        symptom
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
      }
      createdAt
      scheduleType
      facility {
        _id
        name
      }
    }
    }
  }
`;

const CALENDAR_EVENTS_BASIC_INFO = gql`
query events($filter: EventFilter!, $limit: Int, $cursor: String, $orderType: OrderEnum) {
  events(filter: $filter, limit: $limit, cursor: $cursor, orderType: $orderType) {
    isSuccess
    message
    cursor
    events {
      _id
      fromTime
      toTime
      status
      appointmentType
      type
      attendees {
        user {
          _id
          firstName
          lastName
          roles
        }
        type
        response
      }
      facility {
        _id
        name
      }
    }
  }
}
`;


const CALENDAR_EVENTS_EXTEND_INFO = gql`
  query events($filter: EventFilter!, $limit: Int, $cursor: String, $orderType: OrderEnum) {
    events(filter: $filter, limit: $limit, cursor: $cursor, orderType: $orderType) {
      isSuccess
      message
      cursor
      events {
        _id
        fromTime
        toTime
        status
        appointmentType
        type
        call {
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
          patient {
            _id
            firstName
            lastName
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
              insuranceName
              insuranceType
            }
          }
        }
        patient {
          _id
          firstName
          lastName
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
            insuranceName
            insuranceType
          }
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
        info {
          reasons
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
  }
`;

const CALENDAR_EVENTS_DAY_INFO = gql`
  query events($filter: EventFilter!, $limit: Int, $cursor: String, $orderType: OrderEnum) {
    events(filter: $filter, limit: $limit, cursor: $cursor, orderType: $orderType) {
      isSuccess
      message
      cursor
      events {
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
  }
`;


const CALENDAR_EVENTS_DASHBOARD = gql`
query events($filter: EventFilter!, $limit: Int, $cursor: String, $orderType: OrderEnum) {
  events(filter: $filter, limit: $limit, cursor: $cursor, orderType: $orderType) {
    isSuccess
    message
    cursor
    count
    events {
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
      }
      info {
        reasons
      }
      patient {
        firstName
        lastName
        photo
        willDeletedAt
      }
      facility {
        _id
        name
        _id
      }
    }
  }
}
`;

const CALENDAR_EVENTS_OVERVIEW = gql`
query events($filter: EventFilter!, $limit: Int, $cursor: String, $orderType: OrderEnum) {
  events(filter: $filter, limit: $limit, cursor: $cursor, orderType: $orderType) {
    isSuccess
    message
    events {
      _id
      fromTime
      toTime
      appointmentType
      info {
        reasons
      }
    }
  }
}
`;

const CALENDAR_EVENTS_LIST = gql`
query events($filter: EventFilter!, $limit: Int, $cursor: String, $orderType: OrderEnum, $pagination: PaginationInput) {
  events(filter: $filter, limit: $limit, cursor: $cursor, orderType: $orderType, pagination: $pagination) {
    isSuccess
    message
    cursor
    prevCursor
    events {
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
}
`;

const CALENDAR_EVENTS_QUERY = (key = 0) => {
  switch (key) {
    case 0: {
      return CALENDAR_EVENTS_INFO;
    }
    case 1: {
      return CALENDAR_EVENTS_BASIC_INFO;
    }
    case 2: {
      return CALENDAR_EVENTS_EXTEND_INFO;
    }
    case 3: {
      return CALENDAR_EVENTS_DASHBOARD;
    }
    case 4: {
      return CALENDAR_EVENTS_OVERVIEW;
    }
    case 5: {
      return CALENDAR_EVENTS_LIST;
    }
    case 6: {
      return CALENDAR_EVENTS_DAY_INFO;
    }
    default: {
      return CALENDAR_EVENTS_INFO;
    }
  }
};

export default CALENDAR_EVENTS_QUERY;
