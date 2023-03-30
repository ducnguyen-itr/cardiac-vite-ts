import gql from 'graphql-tag';

const UPDAT_BIOFLUX_REPORT = gql`
  mutation updateBiofluxReport($_id: ID!, $status: String!) {
    updateBiofluxReport(_id: $_id, status: $status) {
      isSuccess
      message
      code
    }
  }
`;

export default UPDAT_BIOFLUX_REPORT;
