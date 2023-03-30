import createClient from '../../apolloClient';
import MUTATE_UPDATE_ANALYZE from '../../Mutations/updateAnalyze';

const handleUpdateAnalyze = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: MUTATE_UPDATE_ANALYZE,
      variables,
    });
    const { updateAnalyze } = result?.data;
    if (!updateAnalyze?.isSuccess) {
      throw updateAnalyze.message;
    }
    return updateAnalyze;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateAnalyze;
