import createClient from '../../apolloClient';
import START_CAREPLAN from '../../Mutations/startCarePlan';

const handleStartCarePlan = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: START_CAREPLAN,
      variables,
    });
    const { startCarePlan } = result?.data;
    // if (!startCarePlan?.isSuccess) throw startCarePlan.message;
    return startCarePlan;
  } catch (error) {
    throw error;
  }
};

export default handleStartCarePlan;
