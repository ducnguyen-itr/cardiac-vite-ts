import createClient from '../../apolloClient';
import MUTATE_ADD_DIAGNOSIS from '../../Mutations/addDiagnosis';

const handleAddDiagnosis = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: MUTATE_ADD_DIAGNOSIS,
      variables,
    });
    const { addDiagnosis } = result?.data || {};
    if (!addDiagnosis?.isSuccess) {
      throw addDiagnosis;
    }
    return addDiagnosis;
  } catch (error) {
    throw error;
  }
};
export default handleAddDiagnosis;
