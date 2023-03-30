import createClient from '../../apolloClient';
import CHECK_EXISTENCE_APPOINTMENT from '../../Queries/checkExistenceAppointment';

const fetchCheckExistenceAppointment = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CHECK_EXISTENCE_APPOINTMENT,
      variables,
    });
    const { checkExistenceAppointment } = result?.data || {};
    return checkExistenceAppointment;
  } catch (error) {
    throw error;
  }
};

export default fetchCheckExistenceAppointment;
