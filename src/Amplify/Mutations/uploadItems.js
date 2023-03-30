import gql from 'graphql-tag';

const UPLOAD_ITEMS = gql`
  mutation uploadItems($input: UploadItemsInput!) {
    uploadItems(input: $input) {
      isSuccess
      error
      presignedUrls
    }
  }
`;

export default UPLOAD_ITEMS;
