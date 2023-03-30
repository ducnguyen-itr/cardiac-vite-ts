import gql from 'graphql-tag';
import Study from '../Fragments/study';

const STUDY_REPORT = gql`
  query studyReport($_id: ID!) {
    studyReport(_id: $_id) {
      ...${Study.STUDY_REPORT}
    }
  }
`;

export default STUDY_REPORT;
