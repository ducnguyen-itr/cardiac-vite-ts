import gql from 'graphql-tag';
import Study from '../Fragments/study';

const {
  DIAGNOSIS, FOLLOW_ON_STUDY, BIOFLUX_STUDY,
} = Study;

const BIOFLUX_STUDIES = gql`
  query biofluxStudies($filter: BiofluxStudyFilter, $limit: Int) {
    biofluxStudies(filter: $filter, limit: $limit) {
      ...${BIOFLUX_STUDY}
    }
  }
`;

export default BIOFLUX_STUDIES;
