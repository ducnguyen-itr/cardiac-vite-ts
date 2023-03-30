import gql from 'graphql-tag';

const UPDATE_SF36_RESULT_MUTATION = gql`
  mutation updateSF36Result($_id: ID!, $input: SF36ResultInput!) {
    updateSF36Result(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_SF36_RESULT_MUTATION;
