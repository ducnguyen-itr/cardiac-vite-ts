import gql from 'graphql-tag';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';

const BIOHEART_EXTERNAL_SUMMARY_REPORT = gql`
  query externalSummaryReport($_id: ID!) {
    externalSummaryReport(_id: $_id) {     
      _id
      contentUrl
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
        status
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
      }
      createdAt
      end
      externalStatus
      isChanged
      start
        status
      utcOffset
    }
  }
`;

export default BIOHEART_EXTERNAL_SUMMARY_REPORT;
