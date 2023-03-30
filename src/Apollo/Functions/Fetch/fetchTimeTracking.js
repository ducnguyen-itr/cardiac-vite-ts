import createClient from '../../apolloClient';
import TIME_TRACKING_QUERY from '../../Queries/timeTracking';

const fetchTimeTracking = async (variables, key) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: TIME_TRACKING_QUERY(key),
      variables,
    });
    return result?.data?.timeTracking;
  } catch (error) {
    throw error;
  }
};
export default fetchTimeTracking;
