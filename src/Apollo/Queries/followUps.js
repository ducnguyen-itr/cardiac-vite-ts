import gql from 'graphql-tag';
import { FACILITY } from '../Fragments/patient';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';
import { ID_FULL_NAME, ID_NAME, ID_NAME_PHOTO } from '../Fragments/user';

const FOLLOW_UPS = gql`
  query followUps($filter: FollowUpFilterInput!, $limit: Int!) {
    followUps(filter: $filter, limit: $limit) {
      followUps {
        _id
        carePlan {
          _id
          status
          patientDemographic {
            ...${PATIENT_DEMOGRAPHIC}
          }
          patient {
            ...${ID_FULL_NAME}
            email
            contact {
              phone1
            }
            gender
            dateOfBirth
            willDeletedAt
          }
          facility {
            ...${FACILITY}
          }
          physician {
            ...${ID_NAME}
          }
          nurse {
            ...${ID_NAME}
          }
        }
        isDone
        appointments 
      }
      cursor
    }
  }
`;


const FOLLOW_UPS_DASHBOARD = gql`
  query followUps($filter: FollowUpFilterInput!, $limit: Int!) {
    followUps(filter: $filter, limit: $limit) {
      followUps {
        _id
        carePlan {
          _id
          status
          friendlyId
          patientDemographic {
            firstName
            lastName
          }
          patient {
            willDeletedAt
            photo
          }
          facility {
            name
            _id
          }
        }
      }
      count
    }
  }
`;


const FOLLOW_UPS_OVERVIEW = gql`
  query followUps($filter: FollowUpFilterInput!, $limit: Int!) {
    followUps(filter: $filter, limit: $limit) {
      followUps {
        _id
      }
    }
  }
`;


const FOLLOW_UPS_QUERY = (key = 0) => {
  switch (key) {
    case 0: {
      return FOLLOW_UPS;
    }
    case 1: {
      return FOLLOW_UPS_DASHBOARD;
    }
    case 2: {
      return FOLLOW_UPS_OVERVIEW;
    }
    default: {
      return FOLLOW_UPS;
    }
  }
};

export default FOLLOW_UPS_QUERY;
