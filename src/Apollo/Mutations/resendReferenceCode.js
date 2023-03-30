import gql from 'graphql-tag';

const RESEND_REFERENCE_CODE = gql`
  mutation resendReferenceCode($carePlanId: ID!) {
    resendReferenceCode(carePlanId: $carePlanId) {
      code
      isSuccess
      message
    }
  }
`;

export default RESEND_REFERENCE_CODE;
