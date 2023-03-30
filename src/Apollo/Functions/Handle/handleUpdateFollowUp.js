import createClient from '../../apolloClient';
import UPDATE_FOLLOW_UP from '../../Mutations/updateFollowUp';

const handleUpdateFollowUp = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_FOLLOW_UP,
      variables,
    });
    const { updateFollowUp } = result?.data;
    if (!updateFollowUp?.isSuccess) {
      throw updateFollowUp.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdateFollowUp;
