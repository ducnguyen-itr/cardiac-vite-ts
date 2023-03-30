import createClient from '../../apolloClient';
import CALENDAR_LEAVE_CALL from '../../Mutations/leaveCall';

const handleLeaveCall = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CALENDAR_LEAVE_CALL,
      variables,
    });
    const { leaveCall } = result?.data;
    if (!leaveCall?.isSuccess) {
      throw leaveCall.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleLeaveCall;
