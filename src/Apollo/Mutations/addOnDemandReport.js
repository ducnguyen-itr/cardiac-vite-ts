import gql from 'graphql-tag';

const ADD_ON_DEMAND_REPORT = gql`
  mutation addOnDemandReport($input: addOnDemandReportInput!) {
    addOnDemandReport(input: $input) {
      isSuccess,
      message,
    }
  }
`;
export default ADD_ON_DEMAND_REPORT;
