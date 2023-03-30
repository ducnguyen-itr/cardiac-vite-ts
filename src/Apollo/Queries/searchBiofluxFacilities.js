import gql from 'graphql-tag';

const SEARCH_BIOFLUX_FACILITIES = gql`
  query searchBiofluxFacilities($input: SearchBiofluxFacilitiesInput!) {
    searchBiofluxFacilities(input: $input) {
      _id
      name
    }
  }
`;

export default SEARCH_BIOFLUX_FACILITIES;
