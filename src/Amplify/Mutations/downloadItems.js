import gql from 'graphql-tag';

const DOWNLOAD_ITEMS = gql`
  mutation downloadItems($input: DownloadItemsInput!) {
    downloadItems(input: $input) {
      isSuccess
      error
      presignedUrls
    }
  }
`;

export default DOWNLOAD_ITEMS;
