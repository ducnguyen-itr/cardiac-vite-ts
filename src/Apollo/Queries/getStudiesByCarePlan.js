import gql from 'graphql-tag';
import Study from '../Fragments/study';

const {
  DIAGNOSIS,
} = Study;

const GET_STUDIES_BY_CARE_PLAN = gql`
  query getStudiesByCarePlan($carePlan: ID) {
    getStudiesByCarePlan(carePlan: $carePlan) {
      carePlan
      studyId
      friendlyId
      start
      status
      studyType
      timezone
      initDuration
      patientInfo {
        disagnosis {
          ...${DIAGNOSIS}
        }
      }
      referenceCode
      serviceType
      requestedAt
      expire
    }
  }
`;

export default GET_STUDIES_BY_CARE_PLAN;
