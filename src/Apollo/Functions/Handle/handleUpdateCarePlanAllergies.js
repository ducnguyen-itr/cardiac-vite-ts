import createClient from '../../apolloClient';
import UPDATE_CAREPLAN_ALLERGIES from '../../Mutations/updateCarePlanAllergies';

const handleUpdateCarePlanAllergies = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: UPDATE_CAREPLAN_ALLERGIES,
      variables,
    });
    const { updateCarePlanAllergies } = result?.data || {};
    if (!updateCarePlanAllergies?.isSuccess) throw updateCarePlanAllergies.message;
    return updateCarePlanAllergies;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateCarePlanAllergies;
