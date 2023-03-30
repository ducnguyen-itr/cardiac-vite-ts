import createClient from '../../apolloClient';
import BIOFLUX_INBOXES from '../../Queries/Bioflux0inboxes';

const fetchCountStudyNotification = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BIOFLUX_INBOXES,
      variables,
      limit: 0,
    });
    return result?.data?.Bioflux0inboxes?.recentUnreadCount;
  } catch (error) {
    throw error;
  }
};

export default fetchCountStudyNotification;
