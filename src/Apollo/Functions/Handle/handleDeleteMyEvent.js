import createClient from '../../apolloClient';
import CALENDAR_DELETE_MY_EVENTS from '../../Mutations/deleteMyEvent';

const handleDeleteMyEvent = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CALENDAR_DELETE_MY_EVENTS,
      variables,
    });
    const { deleteMyEvent } = result?.data;
    if (!deleteMyEvent?.isSuccess) {
      throw deleteMyEvent.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleDeleteMyEvent;
