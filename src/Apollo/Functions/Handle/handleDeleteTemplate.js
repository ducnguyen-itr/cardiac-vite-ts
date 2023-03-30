import createClient from '../../apolloClient';
import DELETE_TEMPLATE_MUTATION from '../../Mutations/deleteTemplate';

const handleDeleteTemplate = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: DELETE_TEMPLATE_MUTATION,
      variables,
    });
    const { deleteTemplate } = result?.data;
    return deleteTemplate;
  } catch (error) {
    throw error;
  }
};

export default handleDeleteTemplate;
