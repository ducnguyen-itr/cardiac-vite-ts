import createClient from '../../apolloClient';
import CARE_PLAN_TABLE_QUERY from '../../Queries/carePlanTable';

const fetchCarePlanTable = async (_id, key) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CARE_PLAN_TABLE_QUERY(key),
      variables: { _id },
    });
    return result?.data?.carePlan;
  } catch (error) {
    throw error;
  }
};

export default fetchCarePlanTable;
