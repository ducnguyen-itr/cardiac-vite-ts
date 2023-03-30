import createClient from '../../apolloClient';
import APPOINTMENT_VIDEO from '../../Queries/appointmentVideo';

const fetchAppointmentVideo = async (_id) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: APPOINTMENT_VIDEO,
      variables: { _id },
    });
    const { data } = result;
    const { appointment } = data;
    return appointment;
  } catch (error) {
    throw error;
  }
};

export default fetchAppointmentVideo;
