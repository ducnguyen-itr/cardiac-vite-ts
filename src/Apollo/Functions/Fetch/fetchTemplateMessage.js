import createClient from '../../apolloClient';
import TEMPLATE_MESSAGE_QUERY from '../../Queries/templateMessage';

const fetchTemplateMessage = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: TEMPLATE_MESSAGE_QUERY,
      variables,
    });
    const { templateMessage } = result?.data || {};
    return templateMessage;
  } catch (error) {
    throw error;
  }
};

export default fetchTemplateMessage;
