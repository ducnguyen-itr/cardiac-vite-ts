import createClient from '../../apolloClient';
import CALENDAR_AVAILABLE_CLINIC_USER from '../../Queries/calendar0AvailableClinicUser';

const fetchAvailableClinicUser = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CALENDAR_AVAILABLE_CLINIC_USER,
      variables,
    });

    const { availableClinicUsers } = result?.data || {};
    return availableClinicUsers;
  } catch (error) {
    throw error;
  }
};

export default fetchAvailableClinicUser;
