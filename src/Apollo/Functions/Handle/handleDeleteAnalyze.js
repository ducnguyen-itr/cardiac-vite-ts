import createClient from '../../apolloClient';
import MUTATE_DELETE_ANALYZE from '../../Mutations/deleteAnalyze';

const handleDeleteAnalyze = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: MUTATE_DELETE_ANALYZE,
      variables,
    });
    const { deleteAnalyze } = result?.data || {};
    if (!deleteAnalyze?.isSuccess) throw deleteAnalyze.message;
    return deleteAnalyze;
  } catch (error) {
    throw error;
  }
};

export default handleDeleteAnalyze;
