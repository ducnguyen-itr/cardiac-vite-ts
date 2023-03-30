import createClient from '../../apolloClient';
import TIME_LOG_QUERY from '../../Queries/timelog';

const fetchTimeLog = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: TIME_LOG_QUERY,
      variables,
    });
    return result?.data?.timeLog;
  } catch (error) {
    throw error;
  }
};
export default fetchTimeLog;
