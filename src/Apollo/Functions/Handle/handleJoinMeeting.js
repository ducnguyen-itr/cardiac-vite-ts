import createClient from '../../apolloClient';
import JOIN_MEETING from '../../Mutations/joinMeeting';

const handleJoinMeeting = async (appointmentId) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: JOIN_MEETING,
      variables: { appointmentId },
    });
    const { joinMeeting } = result?.data;
    if (!joinMeeting?.isSuccess) throw joinMeeting.message;
    return joinMeeting;
  } catch (error) {
    throw error;
  }
};

export default handleJoinMeeting;
