import createClient from '../../apolloClient';
import CALENDAR_FINISH_CALL from '../../Mutations/finishCall';

const handleFinishCall = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CALENDAR_FINISH_CALL,
      variables,
    });
    const { finishCall } = result?.data;
    if (!finishCall?.isSuccess) {
      throw finishCall.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleFinishCall;
