import gql from 'graphql-tag';

const BIOFLUX_FACILITIES = gql`
  query biofluxFacilities {
    biofluxFacilities {
      _id
      name
      canUseBiofluxDirect
    }
  }
`;

export default BIOFLUX_FACILITIES;
