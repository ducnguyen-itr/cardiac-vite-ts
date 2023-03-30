import createClient from '../../apolloClient';
import DELETE_TIME_SHEET from '../../Mutations/deleteTimesheet';

const handleDeleteTimesheet = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: DELETE_TIME_SHEET,
      variables,
    });
    const { deleteTimesheet } = result?.data;
    if (!deleteTimesheet?.isSuccess) {
      throw deleteTimesheet.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleDeleteTimesheet;
