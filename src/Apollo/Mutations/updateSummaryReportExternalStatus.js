import gql from 'graphql-tag';

const BIOHEART_UPDATE_SUMMARY_REPORT_STATUS = gql`
  mutation updateSummaryReportExternalStatus($_id: ID!, $externalStatus: SummaryReportExternalStatusEnum!) {
    updateSummaryReportExternalStatus(_id: $_id, externalStatus: $externalStatus) {
      isSuccess
      message
    }
  }
`;

export default BIOHEART_UPDATE_SUMMARY_REPORT_STATUS;
