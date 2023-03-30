import createClient from '../../apolloClient';
import NOTIFICATION from '../../Queries/notification';

const fetchNotification = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: NOTIFICATION,
      variables,
    });
    return result?.data?.notification;
  } catch (error) {
    throw error;
  }
};

export default fetchNotification;
