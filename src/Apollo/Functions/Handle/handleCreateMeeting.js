import createClient from '../../apolloClient';
import CREATE_MEETING from '../../Mutations/createMeeting';

const handleCreateMeeting = async (appointmentId) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CREATE_MEETING,
      variables: { appointmentId },
    });
    const { createMeeting } = result?.data;
    if (!createMeeting?.isSuccess) throw createMeeting.message;
  } catch (error) {
    throw error;
  }
};

export default handleCreateMeeting;
