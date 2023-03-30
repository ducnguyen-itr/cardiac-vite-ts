import createClient from '../../apolloClient';
import CALENDAR_EVENTS_QUERY from '../../Queries/events';

const fetchEvents = async (variables, key = 0) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CALENDAR_EVENTS_QUERY(key),
      variables,
    });
    const { events } = result?.data || {};
    return events;
  } catch (error) {
    throw error;
  }
};

export default fetchEvents;
