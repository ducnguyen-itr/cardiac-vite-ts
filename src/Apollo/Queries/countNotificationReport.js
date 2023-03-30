import gql from 'graphql-tag';

const COUNT_NOTIFICATION_REPORT = gql`
  query countNotificationReport($filter: NotificationReportFilterInput) {
    countNotificationReport(filter: $filter) {
      isSuccess
      message
      count
    }
  }
`;

export default COUNT_NOTIFICATION_REPORT;
