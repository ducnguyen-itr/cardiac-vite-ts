import createClient from '../../apolloClient';
import UPDATE_TIME_SHEET from '../../Mutations/updateTimesheet';

const handleUpdateTimesheet = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_TIME_SHEET,
      variables,
    });
    const { updateTimesheet } = result?.data;
    if (!updateTimesheet?.isSuccess) {
      throw updateTimesheet.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdateTimesheet;
