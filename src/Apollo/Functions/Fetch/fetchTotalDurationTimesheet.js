import createClient from '../../apolloClient';
import TOTAL_DURATION_TIME_SHEET from '../../Queries/totalDurationTimesheet';

const fetchTotalDurationTimesheet = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: TOTAL_DURATION_TIME_SHEET,
      variables,
    });
    return result?.data?.totalDurationTimesheet;
  } catch (error) {
    throw error;
  }
};
export default fetchTotalDurationTimesheet;
