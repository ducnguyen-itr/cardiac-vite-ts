import createClient from '../../apolloClient';
import ADD_SF36_RESULT_MUTATION from '../../Mutations/addSF36Result';

const handleAddSF36Result = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADD_SF36_RESULT_MUTATION,
      variables,
    });
    const { addSF36Result } = result?.data;
    if (!addSF36Result?.isSuccess) throw addSF36Result.message;
    return addSF36Result;
  } catch (error) {
    throw error;
  }
};

export default handleAddSF36Result;
