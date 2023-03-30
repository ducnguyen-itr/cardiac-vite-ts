import gql from 'graphql-tag';

const MUTATE_UPDATE_ANALYZE = gql`
  mutation updateAnalyze($_id: ID!, $input: UpdateAnalyzeInput!) {
    updateAnalyze(_id: $_id, input: $input) {
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

export default MUTATE_UPDATE_ANALYZE;
