import createClient from '../../apolloClient';
import APPOINTMENT from '../../Queries/appointment';

const fetchAppointment = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: APPOINTMENT,
      variables,
    });
    const { appointment } = result?.data || {};
    return appointment;
  } catch (error) {
    throw error;
  }
};

export default fetchAppointment;
