import createClient from '../../apolloClient';
import MUTATE_ON_DEMAND_REPORT from '../../Mutations/addOnDemandReport';

const handleAddOnDemandReport = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: MUTATE_ON_DEMAND_REPORT,
      variables,
    });
    const { addOnDemandReport } = result?.data;
    if (!addOnDemandReport?.isSuccess) {
      throw addOnDemandReport.message;
    }
  } catch (error) {
    throw error;
  }
};
export default handleAddOnDemandReport;
