import gql from 'graphql-tag';

const MARK_AS_READ_CARE_PLAN = gql`
  mutation markAsReadCarePlan($_id: ID!, $input: MarkAsReadCarePlanInput!) {
    markAsReadCarePlan(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default MARK_AS_READ_CARE_PLAN;
