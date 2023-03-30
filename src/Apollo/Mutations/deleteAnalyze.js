import gql from 'graphql-tag';

const MUTATE_DELETE_ANALYZE = gql`
  mutation deleteAnalyze($_id: ID!, $analyzeId: ID!) {
    deleteAnalyze(_id: $_id, analyzeId: $analyzeId) {
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

export default MUTATE_DELETE_ANALYZE;
