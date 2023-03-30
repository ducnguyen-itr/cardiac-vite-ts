import createClient from '../../apolloClient';
import BIOHEART_TOTAL_SUMMARY_REPORTS from '../../Queries/totalExternalSummaryReports';

const fetchTotalSummaryReports = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BIOHEART_TOTAL_SUMMARY_REPORTS,
      variables,
    });
    return result?.data?.totalExternalSummaryReports;
  } catch (error) {
    throw error;
  }
};

export default fetchTotalSummaryReports;
