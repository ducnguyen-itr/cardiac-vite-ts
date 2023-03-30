import gql from 'graphql-tag';

const CANCEL_REQUEST_BIOFLUX_STUDY = gql`
  mutation cancelRequestBiofluxStudy($carePlan: ID!, $referenceCode: String!) {
    cancelRequestBiofluxStudy(carePlan: $carePlan, referenceCode: $referenceCode) {
      isSuccess
      message
    }
  }
`;

export default CANCEL_REQUEST_BIOFLUX_STUDY;
