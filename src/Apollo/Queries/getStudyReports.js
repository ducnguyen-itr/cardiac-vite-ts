import gql from 'graphql-tag';
// import Study from '../Fragments/study';

// const {
//   DIAGNOSIS,
// } = Study;

const GET_STUDY_REPORTS = gql`
  query getStudyReports($filter: BiofluxStudyReportFilter!, $limit: Int) {
    getStudyReports(filter: $filter, limit: $limit) {
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

export default GET_STUDY_REPORTS;
