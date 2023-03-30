import createClient from '../../apolloClient';
import DELETE_CAREPLAN from '../../Mutations/deleteCarePlan';

const handleDeleteCarePlan = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: DELETE_CAREPLAN,
      variables,
    });

    const { deleteCarePlan } = result?.data;
    if (!deleteCarePlan?.isSuccess) {
      throw deleteCarePlan.message;
    }
    return deleteCarePlan;
  } catch (error) {
    throw error;
  }
};


export default handleDeleteCarePlan;
