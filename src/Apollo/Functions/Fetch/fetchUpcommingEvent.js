import createClient from '../../apolloClient';
import CALENDAR_UPCOMING_EVENTS from '../../Queries/upcommingEvent';

const fetchUpcommingEvent = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CALENDAR_UPCOMING_EVENTS,
      variables,
    });
    const { upcommingEvent } = result?.data || {};
    return upcommingEvent;
  } catch (error) {
    throw error;
  }
};

export default fetchUpcommingEvent;
