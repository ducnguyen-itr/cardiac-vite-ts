import gql from 'graphql-tag';
import { CAREPLANE_REPORT_SETTING } from '../Queries/carePlan';

const UPDATE_REPORT_SETTING = gql`
  mutation updateReportSetting($_id: ID!, $input: ReportSettingInput!) {
    updateReportSetting(_id: $_id, input: $input) {
      isSuccess
      message
      carePlan {
        reportSetting {
          ...${CAREPLANE_REPORT_SETTING}
        }
      }
    }
  }
`;

export default UPDATE_REPORT_SETTING;
