import createClient from '../../apolloClient';
import ADD_PRESCRIPTION from '../../Mutations/addPrescription';

const handleAddPrescription = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADD_PRESCRIPTION,
      variables,
    });
    const { addPrescription } = result?.data;
    if (!addPrescription?.isSuccess) throw addPrescription.message;
  } catch (error) {
    throw error;
  }
};

export default handleAddPrescription;
