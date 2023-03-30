import gql from 'graphql-tag';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';
import { ID_NAME } from '../Fragments/user';

const MONTHLY_REPORT_MD_QUERY = gql`
  query report($_id: ID!) {
    report(_id: $_id) {
      _id
      friendlyId
      type
      time
      startDemand
      endDemand
      carePlan {
        _id
        friendlyId
        status
        facility {
          timezone
        }
        patientDemographic {
          ...${PATIENT_DEMOGRAPHIC}
        }
        patient {
          ...${ID_NAME}
          email
          willDeletedAt
        }
        nurse {
          ...${ID_NAME}
          email
        }
        physician {
          ...${ID_NAME}
          email
        }
      }
      sendReportTime
      isReviewed
      physicianInterpretation
      physicianStatus
      reportPath
      isModifyCarePlan
    }
  }
`;

const MONTHLY_REPORT_NURSE_QUERY = gql`
  query report($_id: ID!) {
    report(_id: $_id) {
      _id
      friendlyId
      time
      type
      startDemand
      endDemand
      carePlan {
        _id
        friendlyId
        status
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
        nurse {
          ...${ID_NAME}
        }
        physician {
          ...${ID_NAME}
        }
      }
      sendReportTime
      isReviewed
      nurseInterpretation
      nurseStatus
      physicianStatus
      reportPath
    }
  }
`;

const REPORT_QUERY = (key = 0) => {
  switch (key) {
    case 0: {
      return MONTHLY_REPORT_MD_QUERY;
    }
    case 1: {
      return MONTHLY_REPORT_NURSE_QUERY;
    }
    default: {
      return MONTHLY_REPORT_MD_QUERY;
    }
  }
};

export default REPORT_QUERY;
