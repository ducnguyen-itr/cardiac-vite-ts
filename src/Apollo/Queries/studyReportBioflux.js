import gql from 'graphql-tag';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';

const STUDY_REPORT_BIOFLUX = gql`
  query Bioflux0report($id: ID!) {
    Bioflux0report(id: $id) {
      id
      reportId
      type
      carePlan {
        _id
        friendlyId
        status
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        patient {
          _id
          firstName
          lastName
          middleName
          willDeletedAt
        }
        nurse {
          _id
          firstName
          lastName
          middleName
        }
        physician {
          _id
          firstName
          lastName
          middleName
        }
      }
      study {
        id
        friendlyId
        info {
          technician {
            id
            firstName
            lastName
            middleName
          }
          interprettingPhysician {
            id
            firstName
            lastName
            middleName
          }
        }
      }
      event {
        id
        friendlyId
      }
      inbox {
        date
        lastEmailSentAt
        priority
        isReviewed
        reviewedTime
        isDownloaded
        isRead
      }
    }
  }
`;

export default STUDY_REPORT_BIOFLUX;
