import createClient from '../../apolloClient';
import CARE_PLANS_ON_GOING from '../../Queries/carePlansOnGoing';

const fetchCarePlansOnGoing = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CARE_PLANS_ON_GOING,
      variables,
    });
    return result?.data?.carePlansOnGoing;
  } catch (error) {
    throw error;
  }
};
export default fetchCarePlansOnGoing;
