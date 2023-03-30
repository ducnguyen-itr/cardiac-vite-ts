import gql from 'graphql-tag';

const ADD_SF36_RESULT_MUTATION = gql`
  mutation addSF36Result($carePlanId: ID!, $input: SF36ResultInput!) {
    addSF36Result(carePlanId: $carePlanId, input: $input) {
      isSuccess
      message
    }
  }
`;

export default ADD_SF36_RESULT_MUTATION;
