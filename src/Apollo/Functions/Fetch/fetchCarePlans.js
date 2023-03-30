import createClient from '../../apolloClient';
import CARE_PLANS_QUERY from '../../Queries/carePlans';

const fetchCarePlans = async (variables, key = 0) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CARE_PLANS_QUERY(key),
      variables,
    });
    const { data } = result;
    const { carePlans } = data;
    return carePlans;
  } catch (error) {
    throw error;
  }
};

export default fetchCarePlans;
