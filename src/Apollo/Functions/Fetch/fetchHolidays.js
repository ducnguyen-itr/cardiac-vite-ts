import createClient from '../../apolloClient';
import CALENDAR_HOLIDAYS from '../../Queries/holidays';

const fetchHolidays = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CALENDAR_HOLIDAYS,
      variables,
    });
    const { holidays } = result?.data || {};
    return holidays;
  } catch (error) {
    throw error;
  }
};

export default fetchHolidays;
