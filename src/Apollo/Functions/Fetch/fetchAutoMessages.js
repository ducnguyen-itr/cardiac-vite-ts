import createClient from '../../apolloClient';
import AUTO_MESSAGES_QUERY from '../../Queries/autoMessages';

const fetchAutoMessages = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: AUTO_MESSAGES_QUERY,
      variables,
    });
    const { autoMessages } = result?.data || {};
    if (!autoMessages?.isSuccess) throw autoMessages.message;
    return autoMessages;
  } catch (error) {
    throw error;
  }
};

export default fetchAutoMessages;
