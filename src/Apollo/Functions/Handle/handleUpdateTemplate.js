import createClient from '../../apolloClient';
import UPDATE_TEMPLATE_MUTATION from '../../Mutations/updateTemplate';

const handleUpdateTemplate = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_TEMPLATE_MUTATION,
      variables,
    });
    const { updateTemplate } = result?.data;
    if (!updateTemplate?.isSuccess) {
      throw updateTemplate.message;
    }
    return updateTemplate?.isSuccess;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateTemplate;
