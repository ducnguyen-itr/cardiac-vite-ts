import gql from 'graphql-tag';

const COUNT_BILLABLE_TIME_TRACKING = gql`
  query countBillableTimeTracking($filter: CountBillableTimeTrackingInput) {
    countBillableTimeTracking(filter: $filter) {
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

export default COUNT_BILLABLE_TIME_TRACKING;
