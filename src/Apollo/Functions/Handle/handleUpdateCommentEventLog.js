import createClient from '../../apolloClient';
import UPDATE_COMMENT_EVENT_LOG from '../../Mutations/updateCommentEventLog';

const handleUpdateCommentEventLog = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_COMMENT_EVENT_LOG,
      variables,
    });
    const { updateCommentEventLog } = result?.data;
    if (!updateCommentEventLog?.isSuccess) throw updateCommentEventLog.message;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateCommentEventLog;
