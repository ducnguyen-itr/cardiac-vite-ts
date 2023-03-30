import createClient from '../../apolloClient';
import DELETE_AUTO_MESSAGE_MUTATION from '../../Mutations/deleteAutoMessage';

const handleDeleteAutoMessage = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: DELETE_AUTO_MESSAGE_MUTATION,
      variables,
    });
    const { deleteAutoMessage } = result?.data || {};
    if (!deleteAutoMessage?.isSuccess) throw deleteAutoMessage.message;
    return deleteAutoMessage;
  } catch (error) {
    throw error;
  }
};

export default handleDeleteAutoMessage;
