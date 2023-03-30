import createClient from '../../apolloClient';
import UPDATE_STATUS_PRESCRIBE_NEW_STUDY from '../../Mutations/updateStatusPrescribeNewStudy';

const handleUpdateStatusPrescribeNewStudy = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_STATUS_PRESCRIBE_NEW_STUDY,
      variables,
    });
    const { updateStatusPrescribeNewStudy } = result?.data;
    if (!updateStatusPrescribeNewStudy?.isSuccess) {
      throw updateStatusPrescribeNewStudy.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdateStatusPrescribeNewStudy;
