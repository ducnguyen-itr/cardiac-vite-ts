import createClient from '../../apolloClient';
import UPDATE_CAREPLAN from '../../Mutations/updateCarePlan';

const handleUpdateCarePlan = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_CAREPLAN,
      variables,
    });
    const { updateCarePlan } = result?.data;
    if (!updateCarePlan?.isSuccess) throw updateCarePlan.message;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateCarePlan;
