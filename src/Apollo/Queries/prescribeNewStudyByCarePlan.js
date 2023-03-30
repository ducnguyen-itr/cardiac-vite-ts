import gql from 'graphql-tag';

const PRESCRIBE_NEW_STUDY_BY_CARE_PLAN = gql`
  query prescribeNewStudyByCarePlan($carePlan: ID!) {
    prescribeNewStudyByCarePlan(carePlan: $carePlan) {
      _id
      carePlan {
        _id
        status
        friendlyId
      }
      facilityBioflux
      studyType
      studyCategory
      initDuration
      diagnosisCode
      otherDiagnosisCode
      secondDiagnosisCode
      otherSecondDiagnosisCode
      physiciansNote
      deviceType
      status
      followOnStudy {
        studyType
        initDuration
      }
    }
  }
`;

export default PRESCRIBE_NEW_STUDY_BY_CARE_PLAN;
