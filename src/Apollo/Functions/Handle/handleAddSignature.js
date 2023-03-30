import createClient from '../../apolloClient';
import ADD_SIGNATURE_MUTATION from '../../Mutations/addSignature';

const handleAddSignature = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADD_SIGNATURE_MUTATION,
      variables,
    });
    const { addSignature } = result?.data;
    if (!addSignature?.isSuccess) {
      throw addSignature.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleAddSignature;
