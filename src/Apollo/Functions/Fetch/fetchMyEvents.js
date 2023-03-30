import createClient from '../../apolloClient';
import CALENDAR_MY_EVENTS from '../../Queries/myEvents';

const fetchMyEvents = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CALENDAR_MY_EVENTS,
      variables,
    });
    const { myEvents } = result?.data || {};
    return myEvents;
  } catch (error) {
    throw error;
  }
};

export default fetchMyEvents;
