import gql from 'graphql-tag';

const TIME_TRACKING = gql`
  query timeTracking($filter: TimeTrackingFilter!, $limit: Int) {
    timeTracking(filter: $filter, limit: $limit) {
      cursor
      message
      isSuccess
      timeTracking {
        _id
        billStatus
        transmissionDay {
          count
        }
        carePlan {
          _id
          friendlyId
          stopDate
          startDate
          status
          programType
          facility {
            _id
            name
            contact {
              address
              city
              state
              zip
              country
            }
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
          patientDemographic {
            firstName
            lastName
            dateOfBirth  
            email
            contact {
              address
              city
              state
              stateCode
              zip
              country
              phone1
            }
            patientInfo {
              insuranceName
              insuranceType
              insuranceExpireDate
              insuranceProvincialBilling
            }
          }
          patient {
            _id
            firstName
            lastName
            willDeletedAt
          }
        }
        fromDate
        toDate
        logEntries
        timeLogged
        flag
        bill {
          _id
          friendlyId
          status
          createdAt
          amountPaid
          balance
          unit
          diagnoses {
            code
            description
          }
          services {
            code
            description
            quantity
            price
          }
        }
      }
    }
  }
`;


const TIME_TRACKING_INPROGRESS = gql`
  query timeTracking($filter: TimeTrackingFilter!, $limit: Int) {
    timeTracking(filter: $filter, limit: $limit) {
      cursor
      message
      isSuccess
      timeTracking {
        _id
        carePlan {
          _id
          friendlyId
          stopDate
          startDate
          status
          programType
          facility {
            _id
            name
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
        transmissionDay {
          count
        }
        fromDate
        toDate
        logEntries
        timeLogged
        billStatus
        bill {
          _id
          friendlyId
          status
        }
      }
    }
  }
`;

const TIME_TRACKING_INFO = gql`
  query timeTracking($filter: TimeTrackingFilter!, $limit: Int) {
    timeTracking(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      timeTracking {
        _id
        fromDate
        toDate
        logEntries
        timeLogged
        transmissionDay {
          count
        }
        carePlan {
          stopDate
          status
          startDate
          programType
          activityHistory {
            fromDate
            toDate
          }
        }
        flag
        bill {
          _id
          friendlyId
        }
      }
    }
  }
`;

const TIME_TRACKING_DASHBOARD = gql`
  query timeTracking($filter: TimeTrackingFilter!, $limit: Int) {
    timeTracking(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      count
      timeTracking {
        _id
        fromDate
        toDate
        timeLogged
        carePlan {
          _id
          programType
          patientDemographic {
            firstName
            lastName
          }
          nurse {
            _id
          }
          physician {
            _id
          }
          patient {
            willDeletedAt
          }
          status
        }
      }
    }
  }
`;

const TIME_TRACKING_DEVICE_USAGE = gql`
query timeTracking($filter: TimeTrackingFilter!, $limit: Int) {
  timeTracking(filter: $filter, limit: $limit) {
    isSuccess
    message
    cursor
    count
    timeTracking {
      _id
      fromDate
      toDate
      deviceUsage {
        bloodPressureMonitor {
          count 
          lastUsed
        }
        pulseOximeter {
          count 
          lastUsed
        }
        thermometer {
          count 
          lastUsed
        }
      }
    }
  }
}
`;

const TIME_TRACKING_QUERY = (key = 0) => {
  switch (key) {
    case 0: {
      return TIME_TRACKING;
    }
    case 1: {
      return TIME_TRACKING_INFO;
    }
    case 2: {
      return TIME_TRACKING_DASHBOARD;
    }
    case 3: {
      return TIME_TRACKING_INPROGRESS;
    }
    case 4: {
      return TIME_TRACKING_DEVICE_USAGE;
    }
    default: {
      return TIME_TRACKING;
    }
  }
};

export default TIME_TRACKING_QUERY;
