import createClient from '../../apolloClient';
import CAREPLAN from '../../Queries/carePlan';

const fetchCarePlan = async (variables, key = 0) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CAREPLAN(key),
      variables,
    });
    // const { data } = result;
    return result?.data?.carePlan;
  } catch (error) {
    throw error;
  }
};

export default fetchCarePlan;
