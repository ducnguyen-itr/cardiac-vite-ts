import gql from 'graphql-tag';

import {
  PATIENT_NAME, PATIENT_EMAIL_PHONE, FACILITY, FACILITY_NAME,
} from '../Fragments/patient';
import PATIENT_DEMOGRAPHIC, { PATIENT_DEMOGRAPHIC_NAME, PATIENT_DEMOGRAPHIC_NAME_EMAIL } from '../Fragments/patientDemographic';
import { ROLE_USER_NAME, USER_NAME, ID_NAME_PHOTO_ROLE } from '../Fragments/user';

const NEW_REGISTERED_CAREPLANS_QUERY = gql`
  query carePlans($filter: CarePlanFilterInput, $limit: Int) {
    carePlans(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      carePlans {
        _id
        friendlyId
        nurseStatus
        source
        programType
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        patient {
          ...${PATIENT_EMAIL_PHONE}
        }
        facility {
          ...${FACILITY}
        }
      }
    }
  }
`;

const NEW_ASSIGNED_CAREPLANS_QUERY = gql`
  query carePlans($filter: CarePlanFilterInput, $limit: Int) {
    carePlans(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      carePlans {
        _id
        friendlyId
        nurseAssignedDate
        nurseStatus
        programType
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        patient {
          ...${PATIENT_EMAIL_PHONE}
        }
        facility {
          ...${FACILITY}
        }
        physician {
          ...${ROLE_USER_NAME}
        }
        nurse {
          ...${ROLE_USER_NAME}
        }
      }
    }
  }
`;

const NEW_DELETED_CAREPLANS_QUERY = gql`
  query carePlans($filter: CarePlanFilterInput, $limit: Int) {
    carePlans(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      carePlans {
        _id
        friendlyId
        nurseAssignedDate
        nurseStatus
        programType
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        patient {
          ...${PATIENT_EMAIL_PHONE}
        }
        facility {
          ...${FACILITY}
        }
        physician {
          ...${ROLE_USER_NAME}
        }
        nurse {
          ...${ROLE_USER_NAME}
        }
      }
    }
  }
`;

const NEW_MD_CAREPLANS_QUERY = gql`
  query carePlans($filter: CarePlanFilterInput, $limit: Int) {
    carePlans(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      carePlans {
        _id
        friendlyId
        physicianAssignedDate
        physicianStatus
        programType
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        patient {
          ...${PATIENT_EMAIL_PHONE}
        }
        facility {
          ...${FACILITY}
        }
        nurse {
          ...${ROLE_USER_NAME}
        }
        physician {
          ...${ROLE_USER_NAME}
        }
      }
    }
  }
`;

const ACTIVE_CAREPLANS_QUERY = gql`
  query carePlans($filter: CarePlanFilterInput, $limit: Int) {
    carePlans(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      carePlans {
        _id
        friendlyId
        programType
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        patient {
          ...${PATIENT_EMAIL_PHONE}
          cognitoId
        }
        facility {
          ...${FACILITY}
        }
        nurse {
          ...${ROLE_USER_NAME}
        }
        physician {
          ...${ROLE_USER_NAME}
        }
        startDate
        info {
          frequencyOfFollowUp
          nextDueOnFollowUp
        }
      }
    }
  }
`;

const ACTIVE_CAREPLANS_STUDY_QUERY = gql`
  query carePlans($filter: CarePlanFilterInput, $limit: Int) {
    carePlans(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      carePlans {
        _id
        friendlyId
        programType
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        patient {
          ...${PATIENT_EMAIL_PHONE}
        }
        facility {
          ...${FACILITY}
        }
        nurse {
          ...${ROLE_USER_NAME}
        }
        physician {
          ...${ROLE_USER_NAME}
        }
        startDate
        prescription {
          medications {
            name
          }
        }
        info {
          frequencyOfFollowUp
          nextDueOnFollowUp
        }
      }
    }
  }
`;

const INACTIVE_CAREPLANS_QUERY = gql`
  query carePlans($filter: CarePlanFilterInput, $limit: Int) {
    carePlans(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      carePlans {
        _id
        friendlyId
        programType
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        patient {
          ...${PATIENT_NAME}
        }
        facility {
          ...${FACILITY}
        }
        nurse {
          ...${ROLE_USER_NAME}
        }
        physician {
          ...${ROLE_USER_NAME}
        }
        stopDate
        reason
      }
    }
  }
`;

const CARE_PLANS_MESSAGE = gql`
  query carePlans($filter: CarePlanFilterInput, $limit: Int) {
    carePlans(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      carePlans {
        _id
        friendlyId
        status
        programType
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC_NAME}
        }
        patient {
          ...${PATIENT_NAME}
          cognitoId
        }
        facility {
          ...${FACILITY_NAME}
        }
        nurse {
          ...${ID_NAME_PHOTO_ROLE}
          cognitoId
        }
        physician {
          ...${ID_NAME_PHOTO_ROLE}
          cognitoId
        }
      }
    }
  }
`;


const CARE_PLANS_DASHBOARD = gql`
  query carePlans($filter: CarePlanFilterInput, $limit: Int) {
    carePlans(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      count
      carePlans {
        _id
        friendlyId
        status
        programType
        nurseAssignedDate
        physicianAssignedDate
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC_NAME}
        }
        patient {
          willDeletedAt
          photo
        }
      }
    }
  }
`;


const CARE_PLANS_ADD_PATIENT = gql`
  query carePlans($filter: CarePlanFilterInput, $limit: Int) {
    carePlans(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      count
      carePlans {
        _id
        friendlyId
        status
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
      }
    }
  }
`;


const CARE_PLANS_QUERY = (key = 0) => {
  switch (key) {
    case 1: {
      return NEW_ASSIGNED_CAREPLANS_QUERY;
    }
    case 2: {
      return NEW_MD_CAREPLANS_QUERY;
    }
    case 3: {
      return ACTIVE_CAREPLANS_QUERY;
    }
    case 4: {
      return INACTIVE_CAREPLANS_QUERY;
    }
    case 5: {
      return ACTIVE_CAREPLANS_STUDY_QUERY;
    }
    case 6: {
      return NEW_DELETED_CAREPLANS_QUERY;
    }
    case 7: {
      return CARE_PLANS_MESSAGE;
    }
    case 8: {
      return CARE_PLANS_DASHBOARD;
    }
    case 9: {
      return CARE_PLANS_ADD_PATIENT;
    }
    default: {
      return NEW_REGISTERED_CAREPLANS_QUERY;
    }
  }
};

export default CARE_PLANS_QUERY;
