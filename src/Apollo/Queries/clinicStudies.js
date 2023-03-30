import gql from 'graphql-tag';

import PatientFragment from '../Fragments/patientFragment';
import DeviceFragment from '../Fragments/deviceFragment';
import DiagnosisFragment from '../Fragments/diagnosisFragment';
import { ROLE_USER_NAME } from '../Fragments/user';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';

const CLINIC_STUDIES = gql`
  query Bioflux0clinicStudies($filter: Bioflux0ClinicStudyFilterInput, $limit: Int) {
    Bioflux0clinicStudies(filter: $filter, limit: $limit) {
      id
      friendlyId
      info {
        patient {
          ...${PatientFragment}
        }
        insurance {
          type
          provider
          preAuth
        }
        studySetting {
          duration
        }
        interprettingPhysician {
          id
          firstName
          lastName
          contact {
            phone1
            nightPhone
            fax
          }
          email
        }
        referringPhysician {
          id
          firstName
          lastName
          contact {
            phone1
            nightPhone
            fax
          }
          email
        }
        diagnosis {
          ...${DiagnosisFragment}
        }
        followOnStudy {
          studyType
          duration
        }
      }
      start
      stop
      studyType
      deviceType
      status
      referenceCode
      isBiofluxDirect
      reportDueDate
      timezone
      ecgUploadProgress
      rma
      reports {
        status
        type
        id
        event {
          friendlyId
        }
        inbox {
          date
          priority
          isReviewed
          isRead
          reviewedTime
          isDownloaded
        }
        reportId
        carePlan {
          _id
          friendlyId
        }
        isArtifactReport
        createdAt
        start
        stop
      }
      artifact {
        date
        resolvedAt
        percentage
        lastIssueFound
        commonIssueFound
      }
      lastStudyHistory {
        time
        status
      }
      hasArtifactReport
      linkedStudies {
        id
        friendlyId
        studyType
        initDuration
      }
      facility {
        id
        name
      }
      device {
        ...${DeviceFragment}
      }
      onboarding {
        pacer
      }
      initDuration
      lastEvaluationEvent {
        id
        createdAt
        start
        stripImgs
      }
      isBiofluxDirect
      isTest
      carePlan {
        _id
        friendlyId
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        status
        nurse {
          ...${ROLE_USER_NAME}
        }
        physician {
          ...${ROLE_USER_NAME}
        }
        patient {
          _id
          email
          gender
          dateOfBirth
          firstName
          lastName
          middleName
          contact {
            address
            state
            zip
            phone1
            phone2
            city
          }
          willDeletedAt
        }
      }
    }
  }
`;

const HAS_CLINIC_STUDIES = gql`
  query Bioflux0clinicStudies($filter: Bioflux0ClinicStudyFilterInput, $limit: Int) {
    Bioflux0clinicStudies(filter: $filter, limit: $limit) {
      id
    }
  }
`;

const HAS_CLINIC_STUDY_REPORT = gql`
  query Bioflux0clinicStudies($filter: Bioflux0ClinicStudyFilterInput, $limit: Int) {
    Bioflux0clinicStudies(filter: $filter, limit: $limit) {
      id
      friendlyId
      reports {
        id
        type
        status
        inbox {
          date
        }
      }
    }
  }
`;


const CLINIC_STUDIES_QUERY = (key = 0) => {
  switch (key) {
    case 0: {
      return CLINIC_STUDIES;
    }
    case 1: {
      return HAS_CLINIC_STUDIES;
    }
    case 2: {
      return HAS_CLINIC_STUDY_REPORT;
    }
    default: {
      return CLINIC_STUDIES;
    }
  }
};

export default CLINIC_STUDIES_QUERY;
