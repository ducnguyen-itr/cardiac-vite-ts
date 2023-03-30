import createClient from '../../apolloClient';
import CALENDAR_EVENT_QUERY from '../../Queries/event';

const fetchEvent = async (variables, key) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CALENDAR_EVENT_QUERY(key),
      variables,
    });
    const { event } = result?.data || {};
    return event;
  } catch (error) {
    throw error;
  }
};

export default fetchEvent;
