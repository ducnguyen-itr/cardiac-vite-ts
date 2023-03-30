import createClient from '../../apolloClient';
import DELETE_NOTIFICATION from '../../Mutations/deleteNotification';

const handleDeleteNotification = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: DELETE_NOTIFICATION,
      variables,
    });
    const { deleteNotification } = result?.data;
    if (!deleteNotification?.isSuccess) {
      throw deleteNotification.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleDeleteNotification;
