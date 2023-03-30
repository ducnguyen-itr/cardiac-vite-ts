import gql from 'graphql-tag';

const UPDATE_EXTERNAL_REPORT = gql`
  mutation updateExternalReport($_id: ID!, $input: UpdateExternalReportInput!) {
    updateExternalReport(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_EXTERNAL_REPORT;
