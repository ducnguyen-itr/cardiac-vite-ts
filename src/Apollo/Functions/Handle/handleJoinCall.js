import createClient from '../../apolloClient';
import CALENDAR_JOIN_CALL from '../../Mutations/joinCall';

const handleJoinCall = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CALENDAR_JOIN_CALL,
      variables,
    });
    const { joinCall } = result?.data;
    if (!joinCall?.isSuccess) {
      throw joinCall.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleJoinCall;
