import gql from 'graphql-tag';

const BIOHEART_RETRY_SUMMARY_REPORT = gql`
  mutation retrySummaryReport($_id: ID!) {
    retrySummaryReport(_id: $_id) {
      isSuccess
      message
    }
  }
`;

export default BIOHEART_RETRY_SUMMARY_REPORT;
