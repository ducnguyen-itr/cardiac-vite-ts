import gql from 'graphql-tag';

const UPDATE_CAREPLAN_ALLERGIES = gql`
  mutation updateCarePlanAllergies($_id: ID!, $allergies: String!) {
    updateCarePlanAllergies(_id: $_id, allergies: $allergies) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_CAREPLAN_ALLERGIES;
