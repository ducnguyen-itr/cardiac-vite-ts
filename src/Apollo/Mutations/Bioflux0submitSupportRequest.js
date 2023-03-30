import gql from 'graphql-tag';

const BIOFLUX_SUBMIT_SUPPORT_REQUEST = gql`
  mutation Bioflux0submitSupportRequest($input: Bioflux0SubmitSupportRequestInput!) {
    Bioflux0submitSupportRequest(input: $input) {
      isSuccess
      message
    }
  }
`;

export default BIOFLUX_SUBMIT_SUPPORT_REQUEST;
