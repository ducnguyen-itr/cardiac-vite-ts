import gql from 'graphql-tag';
import Study from '../Fragments/study';

const {
  STUDY_REPORT,
} = Study;

const STUDY_REPORT_EOU = gql`
  query studyReportEoU($carePlan: ID!, $biofluxStudy: ID!) {
    studyReportEoU(carePlan: $carePlan, biofluxStudy: $biofluxStudy) {
      ...${STUDY_REPORT}
    }
  }
`;

export default STUDY_REPORT_EOU;
