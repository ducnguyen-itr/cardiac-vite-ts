import createClient from '../../apolloClient';
import UPDATE_SF36_RESULT_MUTATION from '../../Mutations/updateSF36Result';

const handleUpdateSF36Result = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_SF36_RESULT_MUTATION,
      variables,
    });
    const { updateSF36Result } = result?.data;
    if (!updateSF36Result?.isSuccess) throw updateSF36Result.message;
    return updateSF36Result;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateSF36Result;
