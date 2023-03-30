import createClient from '../../apolloClient';
import ADD_TIME_SHEET from '../../Mutations/addTimesheet';

const handleAddTimesheet = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADD_TIME_SHEET,
      variables,
    });
    const { addTimesheet } = result?.data;
    if (!addTimesheet?.isSuccess) {
      throw addTimesheet.message;
    }
    return addTimesheet;
  } catch (error) {
    throw error;
  }
};

export default handleAddTimesheet;
