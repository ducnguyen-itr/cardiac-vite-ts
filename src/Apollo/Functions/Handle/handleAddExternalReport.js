import createClient from '../../apolloClient';
import MUTATE_ADD_EXTERNAL_REPORT from '../../Mutations/addExternalReport';

const handleAddExternalReport = async (variables) => {
  const client = await createClient();
  const result = await client.mutate({
    mutation: MUTATE_ADD_EXTERNAL_REPORT,
    variables,
  });

  const { addExternalReport } = result.data || {};
  return addExternalReport;
};
export default handleAddExternalReport;
