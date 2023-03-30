import createClient from '../../apolloClient';
import UDPATE_AUTO_MESSAGE_MUTATION from '../../Mutations/updateAutoMessage';

const handleUpdateAutoMessage = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: UDPATE_AUTO_MESSAGE_MUTATION,
      variables,
    });
    const { updateAutoMessage } = result?.data || {};
    if (!updateAutoMessage?.isSuccess) throw updateAutoMessage.message;
    return updateAutoMessage;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateAutoMessage;
