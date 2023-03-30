import createClient from '../../apolloClient';
import ADD_PRESCRIBE_NEW_STUDY from '../../Mutations/addPrescribeNewStudy';

const handleAddPrescribeNewStudy = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADD_PRESCRIBE_NEW_STUDY,
      variables,
    });
    const { addPrescribeNewStudy } = result?.data;
    if (!addPrescribeNewStudy?.isSuccess) {
      throw addPrescribeNewStudy.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleAddPrescribeNewStudy;
