import gql from 'graphql-tag';
import { FACILITY } from './patient';
import { ID_NAME } from './user';


const DIAGNOSIS = gql`
{
  primary
  otherPrimary
  physiciansNote
}
`;

const FOLLOW_ON_STUDY = gql`
{
  _id
  studyType
  initDuration
  studyId
  studyFid
  status
}
`;

const SIMPLE_BIOFLUX_STUDY = gql`
{
  _id
  carePlan
  studyId
  studyFid
  facilityId
  biofluxFacility {
    _id
    name
    canUseBiofluxDirect
  }
  start
  status
  stop
  studyType
  studyCategory
  timezone
  initDuration
  info {
    diagnosis {
      ...${DIAGNOSIS}
    }
  }
  referenceCode
  requestedAt
  expire
  reportStudy
}
`;

// const LINKED_STUDIES = gql`
// {
//   ...${SIMPLE_BIOFLUX_STUDY}
// }
// `;

const BIOFLUX_STUDY = gql`
{
  ...${SIMPLE_BIOFLUX_STUDY}
  followOnStudy {
    ...${FOLLOW_ON_STUDY}
  }
}
`;

// linkedStudies {
//   _id
//   studyId
//   studyFid
//   initDuration
// }
// linkedStudies {
//   ...${LINKED_STUDIES}
// }

const STUDY_REPORT = gql`
{
  _id
  carePlan {
    _id
    friendlyId
    facility {
      ...${FACILITY}
    }
    nurse {
    ...${ID_NAME}
    }
    physician {
    ...${ID_NAME}
    }
  }
  patient {
    ...${ID_NAME}
  }
  biofluxStudy {
    ...${BIOFLUX_STUDY}
  }
  studyId
  reportId
  type
  path
  technicianComment
  isArtifactReport
  inbox {
    date
    priority
  }
  event {
    eventFid
    reason
    type
    originalType
  }
  physicianStatus
  nurseStatus
}
`;


export default {
  DIAGNOSIS, FOLLOW_ON_STUDY, BIOFLUX_STUDY, STUDY_REPORT,
};
