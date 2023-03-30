import createClient from '../../apolloClient';
import TEMPLATES_MESSAGE_QUERY from '../../Queries/templatesMessage';

const fetchTemplatesMessage = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: TEMPLATES_MESSAGE_QUERY,
      variables,
    });
    const { templatesMessage } = result?.data || {};
    if (!templatesMessage?.isSuccess) throw templatesMessage.message;
    return templatesMessage;
  } catch (error) {
    throw error;
  }
};

export default fetchTemplatesMessage;
