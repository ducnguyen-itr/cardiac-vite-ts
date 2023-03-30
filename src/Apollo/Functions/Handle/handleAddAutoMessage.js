import createClient from '../../apolloClient';
import ADD_AUTO_MESSAGE_MUTATION from '../../Mutations/addAutoMessage';

const handleAddAutoMessage = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: ADD_AUTO_MESSAGE_MUTATION,
      variables,
    });
    const { addAutoMessage } = result?.data || {};
    if (!addAutoMessage?.isSuccess) throw addAutoMessage.message;
    return addAutoMessage;
  } catch (error) {
    throw error;
  }
};

export default handleAddAutoMessage;
