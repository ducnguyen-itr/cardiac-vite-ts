import gql from 'graphql-tag';

const UPDATE_REPORT_MUTATION = gql`
  mutation updateReport($_id: ID!, $report: UpdateReportInput) {
    updateReport(_id: $_id, report: $report) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_REPORT_MUTATION;
