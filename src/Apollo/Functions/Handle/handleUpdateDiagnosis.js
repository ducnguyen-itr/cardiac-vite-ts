import createClient from '../../apolloClient';
import MUTATE_UPDATE_DIAGNOSIS from '../../Mutations/updateDiagnosis';

const handleUpdateDiagnosis = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: MUTATE_UPDATE_DIAGNOSIS,
      variables,
    });
    const { updateDiagnosis } = result?.data;
    if (!updateDiagnosis?.isSuccess) throw updateDiagnosis.message;
    return updateDiagnosis;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateDiagnosis;
