import createClient from '../../apolloClient';
import QUERY_MEDICAL_TEST_RESULTS from '../../Queries/medicalTestResults';

const fetchMedicalTestResults = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: QUERY_MEDICAL_TEST_RESULTS,
      variables,
    });
    return result?.data?.medicalTestResults;
  } catch (error) {
    throw error;
  }
};

export default fetchMedicalTestResults;
