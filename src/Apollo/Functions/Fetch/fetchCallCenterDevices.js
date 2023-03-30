import _ from 'lodash';

import createClient from '../../apolloClient';
import CALL_CENTER_DEVICES_QUERY from '../../Queries/callCenterDevices';

const fetchCallCenterDevices = async (filter, limit = 10) => {
  try {
    const client = await createClient();
    const callCenterDevicesResult = await client.query({
      query: CALL_CENTER_DEVICES_QUERY,
      variables: {
        filter,
        limit,
      },
    });
    const { data, errors } = callCenterDevicesResult;
    const { Bioflux0callCenterDevices } = data;
    if (_.isNil(Bioflux0callCenterDevices) && errors?.length) {
      throw new Error(errors[0].message);
    }
    return Bioflux0callCenterDevices;
  } catch (error) {
    throw error;
  }
};


export default fetchCallCenterDevices;
