import createClient from '../../apolloClient';
import DELETE_ON_DEMAND_REPORT from '../../Mutations/deleteOnDemandReport';

const handleDeleteOnDemandReport = async (variables) => {
  const apolloClient = await createClient();
  try {
    const result = await apolloClient.mutate({
      mutation: DELETE_ON_DEMAND_REPORT,
      variables,
    });
    const { deleteOnDemandReport } = result?.data;
    if (!deleteOnDemandReport?.isSuccess) {
      throw deleteOnDemandReport.message;
    }
  } catch (error) {
    throw error;
  }
};
export default handleDeleteOnDemandReport;
