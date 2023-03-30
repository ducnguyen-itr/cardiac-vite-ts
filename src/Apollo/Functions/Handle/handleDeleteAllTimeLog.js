import createClient from '../../apolloClient';
import DELETE_ALL_TIME_LOG from '../../Mutations/deleteAllTimeLog';

const handleDeleteAllTimeLog = async (variables) => {
  const client = await createClient();
  const result = await client.mutate({
    mutation: DELETE_ALL_TIME_LOG,
    variables,
  });
  const { deleteAllTimeLog } = result?.data || {};
  return deleteAllTimeLog;
};

export default handleDeleteAllTimeLog;
