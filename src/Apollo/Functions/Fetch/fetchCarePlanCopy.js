import createClient from '../../apolloClient';
import CARE_PLAN_COPY_QUERY from '../../Queries/carePlanCopy';

const fetchCarePlanCopy = async (_id) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CARE_PLAN_COPY_QUERY,
      variables: { _id },
    });
    return result?.data?.carePlan;
  } catch (error) {
    throw error;
  }
};

export default fetchCarePlanCopy;
