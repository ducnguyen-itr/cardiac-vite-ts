import createClient from '../../apolloClient';
import UPDATE_BILL from '../../Mutations/updateBill';

const handleUpdateBill = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_BILL,
      variables,
    });
    const { updateBill } = result?.data;
    if (!updateBill?.isSuccess) throw updateBill.message;
    return updateBill;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateBill;
