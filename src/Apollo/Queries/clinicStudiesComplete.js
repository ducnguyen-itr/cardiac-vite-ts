import gql from 'graphql-tag';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';

const CLINIC_STUDIES_COMPLETE_QUERY = gql`
  query Bioflux0clinicStudies($filter: Bioflux0ClinicStudyFilterInput, $limit: Int) {
    Bioflux0clinicStudies(filter: $filter, limit: $limit) {
      id
      friendlyId
      info {
        studySetting {
          duration
        }
        followOnStudy {
          studyType
          duration
        }
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
      start
      stop
      studyType
      status
      reports {
        status
        type
        id
        inbox {
          date
        }
      }
      linkedStudies {
        id
        friendlyId
        studyType
      }
      facility {
        id
        name
      }
      initDuration
      referenceCode
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
    }
  }
`;

export default CLINIC_STUDIES_COMPLETE_QUERY;
