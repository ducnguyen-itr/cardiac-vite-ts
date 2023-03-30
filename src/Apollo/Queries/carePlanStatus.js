import gql from 'graphql-tag';

const CARE_PLAN_STATUS_QUERY = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      _id
      status
    }
  }
`;

export default CARE_PLAN_STATUS_QUERY;
