import gql from 'graphql-tag';

const UPDATE_CAREPLAN_CONDITIONS = gql`
  mutation updateCarePlanConditions($_id: ID!, $input: UpdateCarePlanConditionsInput!) {
    updateCarePlanConditions(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_CAREPLAN_CONDITIONS;
