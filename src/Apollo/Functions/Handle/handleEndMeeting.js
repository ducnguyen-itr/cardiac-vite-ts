import createClient from '../../apolloClient';
import END_MEETING from '../../Mutations/endMeeting';

const handleEndMeeting = async (appointmentId) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: END_MEETING,
      variables: { appointmentId },
    });
    const { endMeeting } = result?.data;
    if (!endMeeting?.isSuccess) throw endMeeting.message;
  } catch (error) {
    throw error;
  }
};

export default handleEndMeeting;
