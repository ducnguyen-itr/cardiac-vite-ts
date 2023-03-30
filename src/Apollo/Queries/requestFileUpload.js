import gql from 'graphql-tag';

const REQUEST_FILE_UPLOAD = gql`
query requestFileUpload($input: RequestFileUploadInput!) {
  requestFileUpload(input: $input) {
    isSuccess
    message
    urls
  }
}
`;

export default REQUEST_FILE_UPLOAD;
