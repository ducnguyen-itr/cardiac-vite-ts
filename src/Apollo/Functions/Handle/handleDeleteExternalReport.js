import createClient from '../../apolloClient';
import DELETE_EXTERNAL_REPORT from '../../Mutations/deleteExternalReport';

const handleDeleteExternalReport = async (variables) => {
  const client = await createClient();
  const result = await client.mutate({
    mutation: DELETE_EXTERNAL_REPORT,
    variables,
  });
  const { deleteExternalReport } = result?.data || {};
  return deleteExternalReport;
};

export default handleDeleteExternalReport;
