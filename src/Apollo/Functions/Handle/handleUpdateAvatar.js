import createClient from '../../apolloClient';
import UPDATE_AVATAR from '../../Mutations/updateAvatar';

const handleUpdateAvatar = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_AVATAR,
      variables,
    });
    const { updateAvatar } = result?.data;
    if (!updateAvatar?.isSuccess) {
      throw updateAvatar.message;
    }
    return updateAvatar.user?.photo || '';
  } catch (error) {
    throw error;
  }
};

export default handleUpdateAvatar;
