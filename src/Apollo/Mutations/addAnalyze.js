import gql from 'graphql-tag';

const MUTATE_ADD_ANALYZE = gql`
  mutation addAnalyze($_id: ID!, $input: AddAnalyzeInput!) {
    addAnalyze(_id: $_id, input: $input) {
      isSuccess
      message
      medicalTestResult {
        analyzes {
          _id
          name
          value
          unit
          abnormalFlag
          note
        }
      }
    }
  }
`;

export default MUTATE_ADD_ANALYZE;
