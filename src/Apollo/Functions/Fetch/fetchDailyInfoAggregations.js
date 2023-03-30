import createClient from '../../apolloClient';
import DAILY_INFO_AGGREGATIONS from '../../Queries/dailyInfoAggregations';

const fetchDailyInfoAggregations = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: DAILY_INFO_AGGREGATIONS,
    variables,
  });
  const { dailyInfoAggregations } = result?.data || [];
  return dailyInfoAggregations;
};

export default fetchDailyInfoAggregations;
