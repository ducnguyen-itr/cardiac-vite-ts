import gql from 'graphql-tag';

import { PATIENT_EMAIL_PHONE, FACILITY } from '../Fragments/patient';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';
import { ROLE_USER_NAME } from '../Fragments/user';

const CARE_PLANS_DELETED = gql`
  query carePlansDeleted($filter: CarePlansDeletedFilterInput!, $limit: Int) {
    carePlansDeleted(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      carePlans {
        _id
        friendlyId
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
        deletedDate
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

export default CARE_PLANS_DELETED;
