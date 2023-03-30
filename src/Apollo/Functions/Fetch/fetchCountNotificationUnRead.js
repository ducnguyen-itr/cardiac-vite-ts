import createClient from '../../apolloClient';
import COUNT_NOTICATION_UNREAD from '../../Queries/countNotificationUnRead';

const fetchCountNotificationUnRead = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: COUNT_NOTICATION_UNREAD,
      variables,
    });
    const { data } = result;
    const { countNotificationUnRead } = data;
    return countNotificationUnRead;
  } catch (error) {
    throw error;
  }
};

export default fetchCountNotificationUnRead;
