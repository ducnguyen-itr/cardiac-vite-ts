import gql from 'graphql-tag';

const RESTORE_CARE_PLAN = gql`
  mutation restoreCarePlan($_id: ID!) {
    restoreCarePlan(_id: $_id) {
      isSuccess
      message
    }
  }
`;

export default RESTORE_CARE_PLAN;
