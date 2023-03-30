import gql from 'graphql-tag';

const START_CAREPLAN = gql`
  mutation startCarePlan($_id: ID!, $input: StartCarePlanInput!) {
    startCarePlan(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default START_CAREPLAN;
