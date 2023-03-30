import createClient from '../../apolloClient';
import PATIENT from '../../Queries/patient';

const fetchPatient = async (variables, key = 0) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: PATIENT(key),
      variables,
    });
    return result?.data?.patient;
  } catch (error) {
    throw error;
  }
};

export default fetchPatient;
