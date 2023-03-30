import createClient from '../../apolloClient';
import ATTENDEE_INFO_INROOM from '../../Queries/attendeeInfoInRoom';

const fetchAttendeeInfoInRoom = async (appointmentId) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: ATTENDEE_INFO_INROOM,
      variables: { appointmentId },
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};
export default fetchAttendeeInfoInRoom;
