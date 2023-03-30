import createClient from '../../apolloClient';
import CALENDAR_CREATE_MY_EVENTS from '../../Mutations/createMyEvents';

const handleCreateMyEvents = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CALENDAR_CREATE_MY_EVENTS,
      variables,
    });
    const { createMyEvents } = result?.data;
    if (!createMyEvents?.isSuccess) {
      throw createMyEvents.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleCreateMyEvents;
