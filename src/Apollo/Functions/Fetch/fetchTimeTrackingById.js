import createClient from '../../apolloClient';
import TIME_TRACKING_BY_ID_QUERY from '../../Queries/timeTrackingById';

const fetchTimeTrackingById = async (variables, key = 0) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: TIME_TRACKING_BY_ID_QUERY(key),
      variables,
    });
    return result?.data?.timeTrackingById;
  } catch (error) {
    throw error;
  }
};
export default fetchTimeTrackingById;
