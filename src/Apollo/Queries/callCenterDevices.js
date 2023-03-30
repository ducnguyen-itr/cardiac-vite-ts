import gql from 'graphql-tag';

import DeviceFragment from '../Fragments/deviceFragment';

const CALL_CENTER_DEVICES_QUERY = gql`
  query Bioflux0callCenterDevices($filter: Bioflux0CallCenterDeviceFilterInput, $limit: Int) {
    Bioflux0callCenterDevices(filter: $filter, limit: $limit) {
      ...${DeviceFragment}
    }
  }
`;

export default CALL_CENTER_DEVICES_QUERY;
