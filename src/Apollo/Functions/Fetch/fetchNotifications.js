import createClient from '../../apolloClient';
import NOTIFICATIONS from '../../Queries/notifications';

const fetchNotifications = async (variables, key) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: NOTIFICATIONS(key),
      variables,
    });
    return result?.data?.notifications;
  } catch (error) {
    throw error;
  }
};

export default fetchNotifications;
