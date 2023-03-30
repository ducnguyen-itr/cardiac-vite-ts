import createClient from '../../apolloClient';
import AUTO_MESSAGE_QUERY from '../../Queries/autoMessage';

const fetchAutoMessage = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: AUTO_MESSAGE_QUERY,
      variables,
    });
    const { autoMessage } = result?.data || {};
    return autoMessage;
  } catch (error) {
    throw error;
  }
};

export default fetchAutoMessage;
