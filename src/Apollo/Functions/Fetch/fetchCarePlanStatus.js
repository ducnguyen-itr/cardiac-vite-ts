import createClient from '../../apolloClient';
import CARE_PLAN_STATUS from '../../Queries/carePlanStatus';

const fetchCarePlanStatus = async (_id) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CARE_PLAN_STATUS,
      variables: { _id },
    });
    return result?.data?.carePlan?.status;
  } catch (error) {
    throw error;
  }
};

export default fetchCarePlanStatus;
