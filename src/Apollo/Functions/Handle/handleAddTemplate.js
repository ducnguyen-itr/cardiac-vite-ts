import createClient from '../../apolloClient';
import ADD_TEMPLATE_MUTATION from '../../Mutations/addTemplate';

const handleAddTemplate = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADD_TEMPLATE_MUTATION,
      variables,
    });
    const { addTemplate } = result?.data;
    return addTemplate;
  } catch (error) {
    throw error;
  }
};

export default handleAddTemplate;
