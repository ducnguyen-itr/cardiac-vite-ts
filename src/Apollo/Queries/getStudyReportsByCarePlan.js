import gql from 'graphql-tag';

const GET_STUDY_REPORTS_BY_CARE_PLAN = gql`
  query getStudyReportsByCarePlan($carePlan: ID) {
    getStudyReportsByCarePlan(carePlan: $carePlan) {
      carePlan
      patient
      biofluxStudy
      studyId
      reportId
      type
      path
      technicianComment
      isArtifactReport
      inbox {
        date
        priority
      }
      event {
        eventFid
        reason
        type
        originalType
      }
    }
  }
`;

export default GET_STUDY_REPORTS_BY_CARE_PLAN;
