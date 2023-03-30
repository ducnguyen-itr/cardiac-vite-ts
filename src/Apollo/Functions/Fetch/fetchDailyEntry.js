import createClient from '../../apolloClient';
import QUERY_DAILY_ENTRY from '../../Queries/dailyEntry';

const fetchDailyEntry = async (variables, key) => {
  const client = await createClient();
  const result = await client.query({
    query: QUERY_DAILY_ENTRY(key),
    variables,
  });
  const { dailyEntry } = result?.data || [];
  return dailyEntry;
};

export default fetchDailyEntry;
