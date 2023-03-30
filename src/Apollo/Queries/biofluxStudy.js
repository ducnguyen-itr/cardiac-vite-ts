import gql from 'graphql-tag';
import Study from '../Fragments/study';

const { BIOFLUX_STUDY } = Study;

const BIOFLUX_STUDY_QUERY = gql`
  query biofluxStudy($_id: ID!) {
    biofluxStudy(_id: $_id) {
      ...${BIOFLUX_STUDY}
    }
  }
`;

export default BIOFLUX_STUDY_QUERY;
