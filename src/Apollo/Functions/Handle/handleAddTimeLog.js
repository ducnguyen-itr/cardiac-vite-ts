import createClient from '../../apolloClient';
import ADD_TIME_LOG from '../../Mutations/addTimeLog';


const handleAddTimeLog = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADD_TIME_LOG,
      variables,
    });
    const { addTimeLog } = result?.data;
    if (!addTimeLog?.isSuccess) {
      throw addTimeLog.message;
    }
    return addTimeLog;
  } catch (error) {
    throw error;
  }
};

export default handleAddTimeLog;
