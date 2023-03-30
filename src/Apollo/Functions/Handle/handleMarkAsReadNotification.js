import createClient from '../../apolloClient';
import MARK_AS_READ_NOTIFICATION from '../../Mutations/markAsReadNotification';

const handleMarkAsReadNotification = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: MARK_AS_READ_NOTIFICATION,
      variables,
    });
    const { markAsReadNotification } = result?.data;
    if (!markAsReadNotification?.isSuccess) {
      throw markAsReadNotification.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleMarkAsReadNotification;
