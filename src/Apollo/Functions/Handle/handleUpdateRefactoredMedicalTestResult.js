import createClient from '../../apolloClient';
import MUTATE_UPDATE_REFACTORED_MEDICAL_TEST_RESULT from '../../Mutations/updateRefactoredMedicalTestResult';

const handleUpdateRefactoredMedicalTestResult = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: MUTATE_UPDATE_REFACTORED_MEDICAL_TEST_RESULT,
      variables,
    });
    const { updateMedicalTestResult } = result?.data;
    if (!updateMedicalTestResult?.isSuccess) {
      throw updateMedicalTestResult.message;
    }
    return updateMedicalTestResult;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateRefactoredMedicalTestResult;
