import gql from 'graphql-tag';

const COUNT_MONTHLY_REPORT = gql`
  query countMonthlyReport($filter: MonthlyReportFilterInput) {
    countMonthlyReport(filter: $filter) {
      isSuccess
      message
      count {
        CCM
        RPM 
        CCM_RPM
      }
    }
  }
`;

export default COUNT_MONTHLY_REPORT;
