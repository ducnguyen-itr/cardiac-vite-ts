import createClient from '../../apolloClient';
import UPDAT_BIOFLUX_REPORT from '../../Mutations/updateBiofluxReport';

const handleUpdateBiofluxReport = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDAT_BIOFLUX_REPORT,
      variables,
    });
    const { updateBiofluxReport } = result?.data;
    if (!updateBiofluxReport?.isSuccess) {
      throw updateBiofluxReport.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdateBiofluxReport;
