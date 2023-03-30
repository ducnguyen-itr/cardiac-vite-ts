import gql from 'graphql-tag';
import { ID_NAME } from '../Fragments/user';

const NOTIFICATION_REPORT_TABLE_MD = gql`
  query report($_id: ID!) {
    report(_id: $_id) {
      _id
      time
      carePlan {
        _id
        friendlyId
        patient {
          ...${ID_NAME}
          willDeletedAt
        }
      }
      nurseStatus
      physicianStatus
      reasonNotification
      sendReportTime
    }
  }
`;

const NOTIFICATION_REPORT_TABLE_NURSE = gql`
  query report($_id: ID!) {
    report(_id: $_id) {
      _id
      time
      carePlan {
        _id
        friendlyId
        patient {
          ...${ID_NAME}
          willDeletedAt
        }
      }
      nurseStatus
      physicianStatus
      reasonNotification
    }
  }
`;

const REPORT_TABLE_QUERY = (key) => {
  switch (key) {
    case 1: {
      return NOTIFICATION_REPORT_TABLE_NURSE;
    }
    default: {
      return NOTIFICATION_REPORT_TABLE_MD;
    }
  }
};

export default REPORT_TABLE_QUERY;
