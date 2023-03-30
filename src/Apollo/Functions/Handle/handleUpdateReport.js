import createClient from '../../apolloClient';
import UPDATE_REPORT_MUTATION from '../../Mutations/updateReport';

const handleUpdateReport = async (variables) => {
  const client = await createClient();
  try {
    const updateReportResult = await client.mutate({
      mutation: UPDATE_REPORT_MUTATION,
      variables,
    });
    const { data } = updateReportResult;
    const { updateReport } = data;
    if (!updateReport?.isSuccess) {
      throw updateReport.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdateReport;
