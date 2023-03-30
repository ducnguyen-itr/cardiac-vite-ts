import createClient from '../../apolloClient';
import MUTATION_ADD_REFACTORED_MEDICAL_TEST_RESULT from '../../Mutations/addRefactoredMedicalTestResult';

const handleAddRefactoredMedicalTestResult = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: MUTATION_ADD_REFACTORED_MEDICAL_TEST_RESULT,
      variables,
    });
    const { addMedicalTestResult } = result?.data;
    if (!addMedicalTestResult?.isSuccess) throw addMedicalTestResult.message;
    return addMedicalTestResult;
  } catch (error) {
    throw error;
  }
};

export default handleAddRefactoredMedicalTestResult;
