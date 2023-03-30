import gql from 'graphql-tag';
import { FACILITY_NAME } from '../Fragments/patient';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';
import { ID_NAME, ROLE_USER_NAME } from '../Fragments/user';

const NOTIFICATION_REPORTS_MD = gql`
  query reports($filter: ReportFilterInput!, $limit: Int) {
    reports(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      reports {
        _id
        time
        carePlan {
          _id
          friendlyId
          facility {
            timezone
          }
          patientDemographic {
            ...${PATIENT_DEMOGRAPHIC}
          }
          patient {
            ...${ID_NAME}
            willDeletedAt
          }
          facility {
            ...${FACILITY_NAME}
          }
          nurse {
            ...${ROLE_USER_NAME}
          }
          physician {
            ...${ROLE_USER_NAME}
          }
        }
        nurseStatus
        physicianStatus
        isReviewed
        sendReportTime
        reasonNotification
        sendReportTime
      }
    }  
  }
`;

const NOTIFICATION_REPORTS_NURSE = gql`
  query reports($filter: ReportFilterInput!, $limit: Int) {
    reports(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      reports {
        _id
        time
        carePlan {
          _id
          friendlyId
          facility {
            timezone
          }
          patientDemographic {
            ...${PATIENT_DEMOGRAPHIC}
          }
          patient {
            ...${ID_NAME}
            willDeletedAt
          }
          facility {
            ...${FACILITY_NAME}
          }
          nurse {
            ...${ROLE_USER_NAME}
          }
          physician {
            ...${ROLE_USER_NAME}
          }
        }
        nurseStatus
        physicianStatus
        isReviewed
        sendReportTime
        reasonNotification
      }  
    }
  }
`;

const MONTHLY_REPORTS_QUERY = gql`
  query reports($filter: ReportFilterInput!, $limit: Int) {
    reports(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      reports {
        _id
        time
        carePlan {
          _id
          friendlyId
          facility {
            timezone
          }
          patientDemographic {
            ...${PATIENT_DEMOGRAPHIC}
          }
          patient {
            ...${ID_NAME}
            willDeletedAt
          }
          facility {
            ...${FACILITY_NAME}
          }
          nurse {
            ...${ROLE_USER_NAME}
          }
          physician {
            ...${ROLE_USER_NAME}
          }
        }
        nurseStatus
        physicianStatus
        isReviewed
        sendReportTime
      }
    }
  }
`;

const ON_DEMEND_REPORT_QUERY = gql`
  query reports($filter: ReportFilterInput!, $limit: Int) {
    reports(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      reports {
        _id
        time
        friendlyId
        reportStatus
        startDemand
        endDemand
        carePlan {
          facility {
            timezone
          }
        }
      }
    }
  }
`;


const NORTIFICATION_REPORT_DASHBOARD = gql`
  query reports($filter: ReportFilterInput!, $limit: Int) {
    reports(filter: $filter, limit: $limit) {
      isSuccess
      message
      count
      reports {
        _id
        time
        sendReportTime
        reasonNotification
        carePlan {
          _id
          friendlyId
          facility {
            timezone
          }
          patientDemographic {
            firstName
            lastName
          }
          patient {
            willDeletedAt
          }
        }
      }
    }
  }
`;

const NORTIFICATION_REPORT_OVERVIEW = gql`
  query reports($filter: ReportFilterInput!, $limit: Int) {
    reports(filter: $filter, limit: $limit) {
      isSuccess
      message
      reports {
        _id
        time
        sendReportTime
        reasonNotification
        nurseStatus
        physicianStatus
        isReviewed
        sendReportTime
        carePlan {
          _id
          friendlyId
          facility {
            timezone
          }
          patientDemographic {
            firstName
            lastName
          }
        }
      }
    }
  }
`;

const REPORTS_QUERY = (key = 0) => {
  switch (key) {
    case 0: {
      return NOTIFICATION_REPORTS_MD;
    }
    case 1: {
      return NOTIFICATION_REPORTS_NURSE;
    }
    case 2: {
      return MONTHLY_REPORTS_QUERY;
    }
    case 3: {
      return ON_DEMEND_REPORT_QUERY;
    }
    case 4: {
      return NORTIFICATION_REPORT_DASHBOARD;
    }
    case 5: {
      return NORTIFICATION_REPORT_OVERVIEW;
    }
    default: {
      return MONTHLY_REPORTS_QUERY;
    }
  }
};

export default REPORTS_QUERY;
