import createClient from '../../apolloClient';
import ATTENDEES_APPOINTMENT from '../../Queries/attendeesAppointment';

const fetchAttendeesAppointment = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: ATTENDEES_APPOINTMENT,
      variables,
    });
    return result?.data?.attendeesAppointment || [];
  } catch (error) {
    throw error;
  }
};
export default fetchAttendeesAppointment;
