import createClient from '../../apolloClient';
import APPOINTMENTS from '../../Queries/appointments';

const fetchAppointments = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: APPOINTMENTS,
      variables,
    });
    const { appointments } = result?.data || {};
    return appointments;
  } catch (error) {
    throw error;
  }
};

export default fetchAppointments;
