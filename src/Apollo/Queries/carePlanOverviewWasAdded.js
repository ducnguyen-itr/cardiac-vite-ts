import gql from 'graphql-tag';

const CARE_PLAN_OVERVIEW_WAS_ADDED = gql`
  query carePlanOverviewWasAdded($_id: ID!) {
    carePlanOverviewWasAdded(_id: $_id) {
      isSuccess
      message
      wasAdded
    } 
  }
`;

export default CARE_PLAN_OVERVIEW_WAS_ADDED;
