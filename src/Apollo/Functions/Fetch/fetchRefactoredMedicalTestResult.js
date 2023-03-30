import createClient from '../../apolloClient';
import QUERY_MEDICAL_TEST_RESULT from '../../Queries/medicalTestResult';

const fetchRefactoredMedicalTestResult = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: QUERY_MEDICAL_TEST_RESULT,
      variables,
    });
    return result?.data?.medicalTestResult;
  } catch (error) {
    throw error;
  }
};

export default fetchRefactoredMedicalTestResult;
