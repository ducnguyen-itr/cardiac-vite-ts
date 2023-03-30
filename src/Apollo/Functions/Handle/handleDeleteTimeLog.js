import createClient from '../../apolloClient';
import DELETE_TIME_LOG from '../../Mutations/deleteTimeLog';

const handleDeleteTimeLog = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: DELETE_TIME_LOG,
      variables,
    });
    const { deleteTimeLog } = result?.data;
    if (!deleteTimeLog?.isSuccess) {
      throw deleteTimeLog.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleDeleteTimeLog;
