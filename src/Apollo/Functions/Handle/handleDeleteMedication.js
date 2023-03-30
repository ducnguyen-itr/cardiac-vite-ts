import createClient from '../../apolloClient';
import DELETE_MEDICATION from '../../Mutations/deleteMedication';

const handleDeleteMedication = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: DELETE_MEDICATION,
      variables,
    });
    const { deleteMedication } = result?.data;
    if (!deleteMedication?.isSuccess) {
      throw deleteMedication.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleDeleteMedication;
