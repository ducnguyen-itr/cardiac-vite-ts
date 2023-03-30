import gql from 'graphql-tag';

const STOP_CAREPLAN = gql`
  mutation stopCarePlan($_id: ID!, $input: StopCarePlanInput!) {
    stopCarePlan(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default STOP_CAREPLAN;
