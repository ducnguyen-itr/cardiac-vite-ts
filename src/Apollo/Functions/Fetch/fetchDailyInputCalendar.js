import createClient from '../../apolloClient';
import QUERY_DAILY_INPUT_CALENDAR from '../../Queries/dailyInputCalendar';

const fetchDailyInputCalendar = async (variables, key) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: QUERY_DAILY_INPUT_CALENDAR(key),
      variables,
    });
    const { dailyInputCalendar } = result?.data || [];
    return dailyInputCalendar;
  } catch (error) {
    throw error;
  }
};

export default fetchDailyInputCalendar;
