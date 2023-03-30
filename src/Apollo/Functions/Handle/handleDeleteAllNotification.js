import createClient from '../../apolloClient';
import DELETE_ALL_NOTIFICATION from '../../Mutations/deleteAllNotification';

const handleDeleteAllNotification = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: DELETE_ALL_NOTIFICATION,
      variables,
    });
    const { deleteAllNotification } = result?.data;
    if (!deleteAllNotification?.isSuccess) {
      throw deleteAllNotification.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleDeleteAllNotification;
