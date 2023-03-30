import gql from 'graphql-tag';

const EXTERNAL_REPORTS = gql`
  query externalReports($filter: ExternalReportsFilterInput!, $limit: Int) {
    externalReports(filter: $filter, limit: $limit) {
      isSuccess
      message
      externalReports {
        _id
        name
        source
        attachment {
          url
          fileName
          extension
        }
        date
      }
      cursor
      count
    }
  }
`;

export default EXTERNAL_REPORTS;
