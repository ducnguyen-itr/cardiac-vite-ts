import gql from 'graphql-tag';

const BIOHEART_TOTAL_SUMMARY_REPORTS = gql`
  query totalExternalSummaryReports($filter: ExternalSummaryReportFilter!) {
    totalExternalSummaryReports(filter: $filter) {
      CCM 
      RPM 
      CCM_RPM
    }
  }
`;

export default BIOHEART_TOTAL_SUMMARY_REPORTS;
