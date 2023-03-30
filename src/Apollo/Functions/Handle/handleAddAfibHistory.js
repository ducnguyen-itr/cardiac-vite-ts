import createClient from '../../apolloClient';
import ADD_AFIB_HISTORY from '../../Mutations/addAfibHistory';

const handleAddAfibHistory = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADD_AFIB_HISTORY,
      variables,
    });
    const { addAfibHistory } = result?.data;
    if (!addAfibHistory?.isSuccess) {
      throw addAfibHistory.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleAddAfibHistory;
