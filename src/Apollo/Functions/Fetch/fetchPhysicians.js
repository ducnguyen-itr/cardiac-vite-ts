import _ from 'lodash';

import createClient from '../../apolloClient';
import PHYSICIANS_QUERY from '../../Queries/physicians';

const fetchPhysicians = async (filter, limit = 1000) => {
  try {
    const client = await createClient();
    const physiciansResult = await client.query({
      query: PHYSICIANS_QUERY,
      variables: {
        filter,
        limit,
      },
    });
    const { data, errors } = physiciansResult;
    const { Bioflux0physicians } = data;
    if (_.isNil(Bioflux0physicians) && errors?.length) {
      throw new Error(errors[0].message);
    }
    return Bioflux0physicians;
  } catch (error) {
    throw error;
  }
};

export default fetchPhysicians;
