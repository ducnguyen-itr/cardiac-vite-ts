import gql from 'graphql-tag';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';
import { ROLE_USER_NAME } from '../Fragments/user';

const BIOFLUX_INBOXES = gql`
  query Bioflux0inboxes($filter: Bioflux0InboxFilterInput, $limit: Int) {
    Bioflux0inboxes(filter: $filter, limit: $limit) {
      isSuccess
      message
      recentUnreadCount
      reports {
        id
        reportId
        type
        createdAt
        start
        stop
        status
        inbox {
          date
          priority
          isReviewed
          isRead
          isDownloaded
        }
        event {
          id
          friendlyId
        }
        study {
          id
          friendlyId
          studyType
          status
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
            middleName
            willDeletedAt
          }
          nurse {
            ...${ROLE_USER_NAME}
          }
          physician {
            ...${ROLE_USER_NAME}
          }
          facility {
            _id
            name
          }
        }
      }
    }
  }
`;

export default BIOFLUX_INBOXES;
