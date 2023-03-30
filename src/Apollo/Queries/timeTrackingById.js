import gql from 'graphql-tag';

const TIME_TRACKING_BY_ID = gql`
  query timeTrackingById($_id: ID!, $carePlanId: ID!) {
    timeTrackingById(_id: $_id, carePlanId: $carePlanId) {
      _id
      carePlan {
        _id
        friendlyId
        status
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
          photo
        }
        nurse {
          _id
          firstName
          lastName
          photo
        }
        patientDemographic {
          firstName
          lastName
          dateOfBirth  
          gender
          height
          weight
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
          firstName
          lastName
          email
          photo
        }
        baseline {
          _id
          diagnosis {
            description
            code
            _id
            valid
            customCode
            acuity
            onsetDate
            diagnosedDate
            confirmedVia
            associatedMedications
            diagnosedTypes
            note
            biofluxReport {
              studyId
              facilityName
            }
          }
        }
        info {
          equipmentProvided {
            deviceName
            displayName
          }
        }
        bioheartMonitor {
          isEnabled
        }
        programType
      }
      transmissionDay {
        count
      }
      fromDate
      toDate
      logEntries
      timeLogged
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
`;

const TIME_TRACKING_BY_ID_TRANMISION = gql`
query timeTrackingById($_id: ID!, $carePlanId: ID!) {
  timeTrackingById(_id: $_id, carePlanId: $carePlanId) {
    _id
    transmissionDay {
      count
    }
  }
}
`;

const TIME_TRACKING_BY_ID_QUERY = (key = 0) => {
  switch (key) {
    case 0: {
      return TIME_TRACKING_BY_ID;
    }
    case 1: {
      return TIME_TRACKING_BY_ID_TRANMISION;
    }
    default: {
      return TIME_TRACKING_BY_ID;
    }
  }
};

export default TIME_TRACKING_BY_ID_QUERY;
