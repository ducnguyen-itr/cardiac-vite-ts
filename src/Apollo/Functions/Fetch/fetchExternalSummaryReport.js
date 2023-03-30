import createClient from '../../apolloClient';
import BIOHEART_EXTERNAL_SUMMARY_REPORT from '../../Queries/externalSummaryReport';


const fetchExternalSummaryReport = async (variables) => {
  try {
    const client = await createClient();
    const reportResult = await client.query({
      query: BIOHEART_EXTERNAL_SUMMARY_REPORT,
      variables,
    });
    const { data } = reportResult;
    return data?.externalSummaryReport;
  } catch (error) {
    throw error;
  }
};

export default fetchExternalSummaryReport;
