import createClient from '../../apolloClient';
import ADĐ_BASELINE from '../../Mutations/addBaseline';

const handleAddBaseline = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADĐ_BASELINE,
      variables,
    });
    const { addBaseline } = result?.data;
    if (!addBaseline?.isSuccess) throw addBaseline.message;
  } catch (error) {
    throw error;
  }
};

export default handleAddBaseline;
