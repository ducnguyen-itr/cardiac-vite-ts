import gql from 'graphql-tag';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';

const BIOHEART_EXTERNAL_SUMMARY_REPORTS = gql`
  query externalSummaryReports($filter: ExternalSummaryReportFilter!, $cursor: String, $limit: Int) {
    externalSummaryReports(filter: $filter, cursor: $cursor, limit: $limit) {
      cursor
      summaryReports {
        _id
        carePlan {
          _id
          friendlyId
          patientDemographic {
            ...${PATIENT_DEMOGRAPHIC}
          }
          patient {
            _id
            firstName
            lastName
            willDeletedAt
          }
          facility {
            _id
            name
          }
          nurse {
            _id
            firstName
            lastName
          }
          physician {
            _id
            firstName
            lastName
          }
          status
        }
        createdAt
        end
        externalStatus
        isChanged
        start
        status
        utcOffset
        reason
      }
    }
  }
`;

export default BIOHEART_EXTERNAL_SUMMARY_REPORTS;
