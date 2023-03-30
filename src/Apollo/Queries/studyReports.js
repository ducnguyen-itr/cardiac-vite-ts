import gql from 'graphql-tag';
import Study from '../Fragments/study';

const {
  STUDY_REPORT,
} = Study;

const STUDY_REPORTS = gql`
  query studyReports($filter: BiofluxStudyReportFilter!, $limit: Int) {
    studyReports(filter: $filter, limit: $limit) {
      ...${STUDY_REPORT}
    }
  }
`;

export default STUDY_REPORTS;
