import gql from 'graphql-tag';

const MUTATE_ADD_DIAGNOSIS = gql`
  mutation addDiagnosis($input: AddDiagnosisInput!) {
    addDiagnosis(input: $input) {
      isSuccess
      message
    }
  }
`;

export default MUTATE_ADD_DIAGNOSIS;
