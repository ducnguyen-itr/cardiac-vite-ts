import createClient from '../../apolloClient';
import MARK_ALL_AS_DONE_TIME_LOG from '../../Mutations/markAllAsDoneTimeLog';

const handleMarkAllAsDoneTimeLog = async (variables) => {
  const client = await createClient();
  const result = await client.mutate({
    mutation: MARK_ALL_AS_DONE_TIME_LOG,
    variables,
  });
  const { markAllAsDoneTimeLog } = result?.data || {};
  return markAllAsDoneTimeLog;
};

export default handleMarkAllAsDoneTimeLog;
