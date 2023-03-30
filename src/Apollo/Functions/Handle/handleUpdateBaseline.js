import createClient from '../../apolloClient';
import UPDATE_BASELINE from '../../Mutations/updateBaseline';

const handleUpdateBaseline = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_BASELINE,
      variables,
    });
    const { updateBaseline } = result?.data;
    if (!updateBaseline?.isSuccess) throw updateBaseline.message;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateBaseline;
