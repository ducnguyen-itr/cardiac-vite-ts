import gql from 'graphql-tag';

const BIOHEART_TRANSMISSION_QUERY = gql`
  query bioheartTransmission($filter: BioheartTransmissionFilter!) {
    bioheartTransmission(filter: $filter) {
      isSuccess
      message
      count
      lastReadingTime
    }
  }
`;

export default BIOHEART_TRANSMISSION_QUERY;
