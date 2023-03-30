import createClient from '../../apolloClient';
import PRESCRIPTION_HISTORY from '../../Queries/prescriptionHistory';

const fetchPrescriptionHistory = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: PRESCRIPTION_HISTORY,
      variables,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};
export default fetchPrescriptionHistory;
