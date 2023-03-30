import gql from 'graphql-tag';
import { FACILITY } from '../Fragments/patient';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';
import SIGN_CMM_CONSENT from '../Fragments/signCMMConsent';
import { ID_NAME_PHOTO } from '../Fragments/user';

const CARE_PLANS_ON_GOING = gql`
query carePlansOnGoing($filter: CarePlansOnGoingFilterInput!, $limit: Int) {
  carePlansOnGoing(filter: $filter, limit: $limit) {
    _id
    friendlyId
    programType
    signCMMConsent {
      ...${SIGN_CMM_CONSENT}
    }
    facility {
      ...${FACILITY}
    }
    nurse {
      ...${ID_NAME_PHOTO}
    }
    physician {
      ...${ID_NAME_PHOTO}
    }
    patient {
      ...${ID_NAME_PHOTO}
      email
      gender
      dateOfBirth
      contact {
        phone1
        country
      }
      currentCarePlan {
        _id
        nurse {
          ...${ID_NAME_PHOTO}
        }
        physician {
          ...${ID_NAME_PHOTO}
        }
      }
      willDeletedAt
    }
    patientDemographic {
      ...${PATIENT_DEMOGRAPHIC}
    }
    info {
      frequencyOfFollowUp
      nextDueOnFollowUp
    }
  }
}
`;

export default CARE_PLANS_ON_GOING;
