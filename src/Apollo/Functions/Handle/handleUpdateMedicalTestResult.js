import createClient from '../../apolloClient';
import UPDATE_MEDICAL_TEST_RESULT from '../../Mutations/updateMedicalTestResult';

const handleUpdateMedicalTestResult = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_MEDICAL_TEST_RESULT,
      variables,
    });
    const { updateMedicalTestResult } = result?.data;
    if (!updateMedicalTestResult?.isSuccess) {
      throw updateMedicalTestResult.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdateMedicalTestResult;
