import gql from 'graphql-tag';

const UPDATE_CCM_CONSENT = gql`
  mutation updateCCMConsent($_id: ID!, $signaturePath: String!) {
    updateCCMConsent(_id: $_id, signaturePath: $signaturePath) {
      isSuccess
      message
      consent {
        attachments
      }
    }
  }
`;

export default UPDATE_CCM_CONSENT;
