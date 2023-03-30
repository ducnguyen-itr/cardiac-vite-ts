import createClient from '../../apolloClient';
import EVENT_LOG from '../../Queries/eventLog';

const fetchEventLog = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: EVENT_LOG,
      variables,
    });
    return result?.data?.eventLog;
  } catch (error) {
    throw error;
  }
};
export default fetchEventLog;
