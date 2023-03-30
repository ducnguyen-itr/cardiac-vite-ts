import createClient from '../../apolloClient';
import BIOHEART_RETRY_SUMMARY_REPORT from '../../Mutations/retrySummaryReport';

const handleRetrySummaryReport = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: BIOHEART_RETRY_SUMMARY_REPORT,
      variables,
    });
    const { retrySummaryReport } = result?.data;
    if (!retrySummaryReport?.isSuccess) {
      throw retrySummaryReport.message;
    }
    return retrySummaryReport?.isSuccess;
  } catch (error) {
    throw error;
  }
};

export default handleRetrySummaryReport;
