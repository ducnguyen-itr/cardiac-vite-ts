import gql from 'graphql-tag';
import Study from '../Fragments/study';

const {
  BIOFLUX_STUDY,
} = Study;

const CURRENT_BIOFLUX_STUDY = gql`
  query currentBiofluxStudy($carePlan: ID) {
    currentBiofluxStudy(carePlan: $carePlan) {
      ...${BIOFLUX_STUDY}
    }
  }
`;

export default CURRENT_BIOFLUX_STUDY;
