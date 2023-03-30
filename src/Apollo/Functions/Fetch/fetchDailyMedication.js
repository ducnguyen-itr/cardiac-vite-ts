import createClient from '../../apolloClient';
import DAILY_MEDICATION from '../../Queries/dailyMedication';

const fetchDailyMedication = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: DAILY_MEDICATION,
      variables,
    });
    const { dailyMedication } = result?.data || [];
    return dailyMedication;
  } catch (error) {
    throw error;
  }
};

export default fetchDailyMedication;
