import gql from 'graphql-tag';
import { PATIENT_INFO } from '../Fragments/patient';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';
import { ROLE_USER_NAME } from '../Fragments/user';

const PRESCRIBE_NEW_STUDIES = gql`
  query prescribeNewStudies($filter: PrescribeNewStudyFilterInput, $limit: Int) {
    prescribeNewStudies(filter: $filter, limit: $limit) {
      _id
      carePlan {
        _id
        friendlyId
        status
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        nurse {
          ...${ROLE_USER_NAME}
        }
        physician {
          ...${ROLE_USER_NAME}
        }
        patient {
          ...${PATIENT_INFO}
        }
        facility {
          _id
          name
        }
      }
      studyType
      studyCategory
      initDuration
      diagnosisCode
      status
      createdBy {
        _id
        firstName
        lastName
      }
      followOnStudy {
        studyType
        initDuration
      }
    }
  }
`;

export default PRESCRIBE_NEW_STUDIES;
