import gql from 'graphql-tag';

const UPDATE_CAREPLAN = gql`
  mutation updateCarePlan($_id: ID!, $input: UpdateCarePlanInput!) {
    updateCarePlan(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_CAREPLAN;
