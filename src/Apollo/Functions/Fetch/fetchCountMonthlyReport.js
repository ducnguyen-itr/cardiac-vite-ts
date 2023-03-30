import createClient from '../../apolloClient';
import COUNT_MONTHLY_REPORT from '../../Queries/countMonthlyReport';

const fetchCountMonthlyReport = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: COUNT_MONTHLY_REPORT,
      variables,
    });
    return result?.data?.countMonthlyReport?.count;
  } catch (error) {
    throw error;
  }
};

export default fetchCountMonthlyReport;
