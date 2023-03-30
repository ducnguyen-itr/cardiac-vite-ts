import createClient from '../../apolloClient';
import COUNT_STATUS_CAREPLAN from '../../Queries/countStatusCarePlan';

const fetchCountStatusCarePlan = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: COUNT_STATUS_CAREPLAN,
      variables,
    });
    return result?.data?.countStatusCarePlan?.count;
  } catch (error) {
    throw error;
  }
};

export default fetchCountStatusCarePlan;
