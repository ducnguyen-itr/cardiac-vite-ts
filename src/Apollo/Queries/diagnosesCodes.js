import gql from 'graphql-tag';

const DIAGNOSIS_CODES_QUERY = gql`
  query diagnosesCodes($filter: DiagnosesCodesFilterInput) {
    diagnosesCodes(filter: $filter) {
      code
      description
    }
  }
`;

export default DIAGNOSIS_CODES_QUERY;
