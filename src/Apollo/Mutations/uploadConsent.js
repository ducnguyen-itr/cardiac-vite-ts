import gql from 'graphql-tag';

const UPLOAD_CONSENT = gql`
  mutation uploadConsent($input: UploadConsentInput!) {
    uploadConsent(input: $input) {
      isSuccess
      message
      consent {
        attachments { 
          type 
          url
        }
        signatures {
          type 
          date
        }
      }
    }
  }
`;

export default UPLOAD_CONSENT;
