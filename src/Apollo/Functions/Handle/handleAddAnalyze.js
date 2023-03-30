import createClient from '../../apolloClient';
import MUTATE_ADD_ANALYZE from '../../Mutations/addAnalyze';

const handleAddAnalyze = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: MUTATE_ADD_ANALYZE,
      variables,
    });
    const { addAnalyze } = result?.data;
    if (!addAnalyze?.isSuccess) {
      throw addAnalyze.message;
    }
    return addAnalyze;
  } catch (error) {
    throw error;
  }
};

export default handleAddAnalyze;
