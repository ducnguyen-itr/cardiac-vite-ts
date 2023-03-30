import createClient from '../../apolloClient';
import DELETE_TEMPLATE_MESSAGE_MUTATION from '../../Mutations/deleteTemplateMessage';

const handleDeleteTemplateMessage = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: DELETE_TEMPLATE_MESSAGE_MUTATION,
      variables,
    });
    const { deleteTemplateMessage } = result?.data || {};
    if (!deleteTemplateMessage?.isSuccess) throw deleteTemplateMessage.message;
    return deleteTemplateMessage;
  } catch (error) {
    throw error;
  }
};

export default handleDeleteTemplateMessage;
