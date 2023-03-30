import gql from 'graphql-tag';

const PRESCRIBE_NEW_STUDY = gql`
  query prescribeNewStudy($_id: ID!) {
    prescribeNewStudy(_id: $_id) {
      carePlan {
        _id
        status
        friendlyId
      }
      patient {
        _id
        cognitoId
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
      status
      followOnStudy {
        studyType
        initDuration
      }
    }
  }
`;

export default PRESCRIBE_NEW_STUDY;
