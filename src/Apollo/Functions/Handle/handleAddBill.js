import createClient from '../../apolloClient';
import ADD_BILL from '../../Mutations/addBill';

const handleAddBill = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADD_BILL,
      variables,
    });
    const { addBill } = result?.data;
    if (!addBill?.isSuccess) throw addBill.message;
    return addBill;
  } catch (error) {
    throw error;
  }
};

export default handleAddBill;
