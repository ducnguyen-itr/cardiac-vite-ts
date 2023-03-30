import createClient from '../../apolloClient';
import DELETE_DIAGNOSIS from '../../Mutations/deleteDiagnosis';

const handleDeleteDiagnosis = async (variables) => {
  const client = await createClient();
  const result = await client.mutate({
    mutation: DELETE_DIAGNOSIS,
    variables,
  });
  const { deleteDiagnosis } = result?.data || {};
  return deleteDiagnosis;
};

export default handleDeleteDiagnosis;
