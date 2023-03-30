import createClient from '../../apolloClient';
import UPDATE_TIME_LOG from '../../Mutations/updateTimeLog';

const handleUpdateTimeLog = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_TIME_LOG,
      variables,
    });
    const { updateTimeLog } = result?.data;
    if (!updateTimeLog?.isSuccess) {
      throw updateTimeLog.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdateTimeLog;
