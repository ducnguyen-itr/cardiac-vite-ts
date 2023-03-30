import gql from 'graphql-tag';

const MUTATE_UPDATE_DIAGNOSIS = gql`
  mutation updateDiagnosis($_id: ID!, $input: UpdateDiagnosisInput!) {
    updateDiagnosis(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default MUTATE_UPDATE_DIAGNOSIS;
