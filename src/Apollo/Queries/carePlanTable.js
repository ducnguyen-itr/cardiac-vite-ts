import gql from 'graphql-tag';

import { PATIENT_EMAIL_PHONE } from '../Fragments/patient';
import { USER_NAME } from '../Fragments/user';

const NEW_REGISTERED_CARE_PLAN_TABLE_QUERY = gql`
  query carePlans($_id: ID!) {
    carePlans(_id: $_id) {
      _id
      friendlyId
      patient {
        ...${PATIENT_EMAIL_PHONE}
      }
    }
  }
`;

const NEW_ASSIGNED_CARE_PLAN_TABLE_QUERY = gql`
  query carePlans($_id: ID!) {
    carePlans(_id: $_id) {
      _id
      friendlyId
      patient {
        ...${PATIENT_EMAIL_PHONE}
      }
      physician {
        ...${USER_NAME}
      }
    }
  }
`;

const NEW_MD_CARE_PLAN_TABLE_QUERY = gql`
  query carePlans($_id: ID!) {
    carePlans(_id: $_id) {
      _id
      friendlyId
      patient {
        ...${PATIENT_EMAIL_PHONE}
      }
      nurse {
        ...${USER_NAME}
      }
    }
  }
`;

const CARE_PLAN_TABLE_QUERY = (key = 0) => {
  switch (key) {
    case 1: {
      return NEW_REGISTERED_CARE_PLAN_TABLE_QUERY;
    }
    case 2: {
      return NEW_ASSIGNED_CARE_PLAN_TABLE_QUERY;
    }
    default: {
      return NEW_MD_CARE_PLAN_TABLE_QUERY;
    }
  }
};

export default CARE_PLAN_TABLE_QUERY;
