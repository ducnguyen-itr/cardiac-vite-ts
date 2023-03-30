import createClient from '../../apolloClient';
import ADD_MEDICAL_TEST_RESULT from '../../Mutations/addMedicalTestResult';

const handleAddMedicalTestResult = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADD_MEDICAL_TEST_RESULT,
      variables,
    });
    const { addMedicalTestResult } = result?.data;
    if (!addMedicalTestResult?.isSuccess) {
      throw addMedicalTestResult.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleAddMedicalTestResult;
