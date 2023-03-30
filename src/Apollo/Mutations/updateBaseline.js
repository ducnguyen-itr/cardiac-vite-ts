import gql from 'graphql-tag';

const UPDATE_BASELINE = gql`
  mutation updateBaseline($_id: ID!, $input: UpdateBaselineInput!) {
    updateBaseline(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_BASELINE;
