import createClient from '../../apolloClient';
import UPDATE_CAREPLAN_CONDITIONS from '../../Mutations/updateCarePlanConditions';

const handleUpdateCarePlanConditions = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_CAREPLAN_CONDITIONS,
      variables,
    });
    const { updateCarePlanConditions } = result?.data;
    if (!updateCarePlanConditions?.isSuccess) throw updateCarePlanConditions.message;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateCarePlanConditions;
