import gql from 'graphql-tag';

const BIOFLUX_0_FACILITY = gql`
query Bioflux0facility($id: ID!) {
  Bioflux0facility(id: $id) {
    id
    name
    studySetting {
      duration
      preEventTime
      postEventTime
      bradycardiaThreshold
      tachycardiaThreshold
      pauseLevel
      pauseDetection
      afibDetection
      diagnosticLead
    }
  }
}
`;

export default BIOFLUX_0_FACILITY;
