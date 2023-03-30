import createClient from '../../apolloClient';
import BIOHEART_UPDATE_SUMMARY_REPORT_STATUS from '../../Mutations/updateSummaryReportExternalStatus';

const handleUpdateSummaryReportExternalStatus = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: BIOHEART_UPDATE_SUMMARY_REPORT_STATUS,
      variables,
    });
    const { updateSummaryReportExternalStatus } = result?.data;
    if (!updateSummaryReportExternalStatus?.isSuccess) {
      throw updateSummaryReportExternalStatus.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdateSummaryReportExternalStatus;
