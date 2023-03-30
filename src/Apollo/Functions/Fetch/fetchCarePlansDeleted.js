import createClient from '../../apolloClient';

import CARE_PLANS_DELETED from '../../Queries/carePlansDeleted';

const fetchCarePlansDeleted = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CARE_PLANS_DELETED,
      variables,
    });
    const { data } = result;
    const { carePlansDeleted } = data;
    return carePlansDeleted;
  } catch (error) {
    throw error;
  }
};

export default fetchCarePlansDeleted;
