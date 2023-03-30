import gql from 'graphql-tag';

const MUTATE_ADD_EXTERNAL_REPORT = gql`
  mutation addExternalReport($input: AddExternalReportInput) {
    addExternalReport(input: $input) {
      isSuccess
      message
      externalReport {
        _id
        name
        source
        attachment {
          url
          fileName
          extension
        }
        date
      }
    }
  }
`;

export default MUTATE_ADD_EXTERNAL_REPORT;
