import createClient from '../../apolloClient';
import EVENT_LOGS from '../../Queries/eventLogs';

const fetchEventLogs = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: EVENT_LOGS,
      variables,
    });
    return result?.data?.eventLogs;
  } catch (error) {
    throw error;
  }
};
export default fetchEventLogs;
