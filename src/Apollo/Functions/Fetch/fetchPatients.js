import createClient from '../../apolloClient';
import PATIENTS from '../../Queries/patients';

const fetchPatients = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: PATIENTS,
      variables,
    });
    return result?.data?.patients;
  } catch (error) {
    throw error;
  }
};
export default fetchPatients;
