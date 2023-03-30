import createClient from '../../apolloClient';
import CALENDAR_AVAILABLE_CLINIC_USERS from '../../Queries/availableClinicUsers';

const fetchAvailableClinicUsers = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CALENDAR_AVAILABLE_CLINIC_USERS,
      variables,
    });
    const { availableClinicUsers } = result?.data || {};
    return availableClinicUsers?.users;
  } catch (error) {
    throw error;
  }
};

export default fetchAvailableClinicUsers;
