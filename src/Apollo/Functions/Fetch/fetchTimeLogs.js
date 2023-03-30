import createClient from '../../apolloClient';
import TIME_LOGS_QUERY from '../../Queries/timeLogs';

const fetchTimeLogs = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: TIME_LOGS_QUERY,
      variables,
    });
    return result?.data?.timeLogs;
  } catch (error) {
    throw error;
  }
};
export default fetchTimeLogs;
