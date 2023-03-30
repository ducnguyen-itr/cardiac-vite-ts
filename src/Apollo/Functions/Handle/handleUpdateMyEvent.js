import createClient from '../../apolloClient';
import CALENDAR_UPDATE_MY_EVENT from '../../Mutations/updateMyEvent';

const handleUpdateMyEvent = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CALENDAR_UPDATE_MY_EVENT,
      variables,
    });
    const { updateMyEvent } = result?.data;
    if (!updateMyEvent?.isSuccess) {
      throw updateMyEvent.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdateMyEvent;
