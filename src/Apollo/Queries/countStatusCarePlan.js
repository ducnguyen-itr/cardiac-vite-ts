import gql from 'graphql-tag';

const COUNT_STATUS_CAREPLAN = gql`
  query countStatusCarePlan($filter: StatusCarePlanFilterInput) {
    countStatusCarePlan(filter: $filter) {
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

export default COUNT_STATUS_CAREPLAN;
