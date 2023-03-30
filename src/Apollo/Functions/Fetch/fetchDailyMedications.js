

import createClient from '../../apolloClient';
import DAILY_MEDICATIONS from '../../Queries/dailyMedications';

const fetchDailyMedications = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: DAILY_MEDICATIONS,
    variables,
  });
  const { dailyMedications } = result?.data || [];
  return dailyMedications;
};

export default fetchDailyMedications;
