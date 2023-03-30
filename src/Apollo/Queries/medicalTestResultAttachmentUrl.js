import gql from 'graphql-tag';

const QUERY_MEDICAL_TEST_RESULT_ATTACHMENT_URL = gql`
  query medicalTestResultAttachmentUrl($_id: ID!, $attachmentId: ID!) {
    medicalTestResultAttachmentUrl(_id: $_id, attachmentId: $attachmentId) {
      _id
      url
    }
  }
`;

export default QUERY_MEDICAL_TEST_RESULT_ATTACHMENT_URL;
