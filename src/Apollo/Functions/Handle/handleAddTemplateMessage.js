import createClient from '../../apolloClient';
import ADD_TEMPLATE_MESSAGE_MUTATION from '../../Mutations/addTemplateMessage';

const handleAddTemplateMessage = async (variables) => {
  try {
    const apolloClient = await createClient();
    const result = await apolloClient.mutate({
      mutation: ADD_TEMPLATE_MESSAGE_MUTATION,
      variables,
    });
    const { addTemplateMessage } = result?.data || {};
    if (!addTemplateMessage?.isSuccess) throw addTemplateMessage.message;
    return addTemplateMessage;
  } catch (error) {
    throw error;
  }
};

export default handleAddTemplateMessage;
