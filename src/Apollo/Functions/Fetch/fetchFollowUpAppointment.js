import createClient from '../../apolloClient';
import FOLLOW_UP_APPOINTMENT from '../../Queries/followUpAppointment';

const fetchFollowUpAppointment = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: FOLLOW_UP_APPOINTMENT,
      variables,
    });
    const { appointment } = result?.data || {};
    return appointment;
  } catch (error) {
    throw error;
  }
};

export default fetchFollowUpAppointment;
