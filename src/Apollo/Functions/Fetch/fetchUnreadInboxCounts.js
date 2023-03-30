import createClient from '../../apolloClient';
import BIOFLUX_UNREAD_INBOX_COUNTS from '../../Queries/bioflux0unreadInboxCounts';

const fetchUnreadInboxCounts = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BIOFLUX_UNREAD_INBOX_COUNTS,
      variables,
    });
    const { data } = result;
    const { Bioflux0unreadInboxCounts } = data;
    return Bioflux0unreadInboxCounts?.count;
  } catch (error) {
    throw error;
  }
};

export default fetchUnreadInboxCounts;
