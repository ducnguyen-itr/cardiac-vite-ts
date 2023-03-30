
import gql from 'graphql-tag';
import { FACILITY_NAME, PATIENT_EMAIL_NAME, PATIENT_NAME } from '../Fragments/patient';
import { PATIENT_DEMOGRAPHIC_NAME, PATIENT_DEMOGRAPHIC_NAME_EMAIL } from '../Fragments/patientDemographic';
import { ID_NAME_PHOTO_ROLE } from '../Fragments/user';

const LATEST_CARE_PLAN_BY_COGNITOIDS = gql`
query latestCarePlanByCognitoIds($cognitoIds: [String!]!) {
  latestCarePlanByCognitoIds(cognitoIds: $cognitoIds) {
    _id
    friendlyId
    status
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
`;

export default LATEST_CARE_PLAN_BY_COGNITOIDS;
