import createClient from '../../apolloClient';
import UPDATE_EXTERNAL_REPORT from '../../Mutations/updateExternalReport';

const handleUpdateExternalReport = async (variables) => {
  const client = await createClient();
  const result = await client.mutate({
    mutation: UPDATE_EXTERNAL_REPORT,
    variables,
  });
  const { updateExternalReport } = result?.data || {};
  return updateExternalReport;
};

export default handleUpdateExternalReport;
