

import createClient from '../../apolloClient';
import DAILY_INFOS from '../../Queries/dailyInfos';

const fetchDailyInfos = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: DAILY_INFOS,
    variables,
  });
  const { dailyInfos } = result?.data || [];
  return dailyInfos;
};

export default fetchDailyInfos;
