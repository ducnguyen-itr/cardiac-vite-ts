import createClient from '../../apolloClient';
import UPDATE_WORKING_TIME from '../../Mutations/updateWorkingTime';

const handleUpdateWorkingTime = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: UPDATE_WORKING_TIME,
      variables,
    });
    const { updateWorkingTime } = result?.data || {};
    if (!updateWorkingTime?.isSuccess) throw updateWorkingTime.message;
    return updateWorkingTime;
  } catch (error) {
    throw error;
  }
};
export default handleUpdateWorkingTime;
