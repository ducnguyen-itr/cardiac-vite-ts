import gql from 'graphql-tag';

const UPDATE_BIOHEART_MONITOR = gql`
  mutation updateBioheartMonitor($carePlanId: ID!, $isEnabled: Boolean, $reportFrequency: Int) {
    updateBioheartMonitor(carePlanId: $carePlanId, isEnabled: $isEnabled, reportFrequency: $reportFrequency) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_BIOHEART_MONITOR;
