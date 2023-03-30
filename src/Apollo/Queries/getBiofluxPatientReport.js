import gql from 'graphql-tag';

const GET_BIOFLUX_PATIENT_REPORT = gql`
  query getBiofluxPatientReport($input: BiofluxPatientReportFilter!) {
    getBiofluxPatientReport(input: $input)
  }
`;

export default GET_BIOFLUX_PATIENT_REPORT;
