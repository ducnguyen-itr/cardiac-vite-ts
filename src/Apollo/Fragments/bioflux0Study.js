import gql from 'graphql-tag';
import DeviceFragment from './deviceFragment';
import DiagnosisFragment from './diagnosisFragment';
import PatientFragment from './patientFragment';


const BIOFLUX_0_STUDY_FRAGMENT = gql`{
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
    status
    isBiofluxDirect
    reportDueDate
    timezone
    ecgUploadProgress
    rma
    reports {
      status
      type
      id
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
      status
    }
}`;
export default BIOFLUX_0_STUDY_FRAGMENT;
