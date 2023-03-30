import createClient from '../../apolloClient';
import STOP_CAREPLAN from '../../Mutations/stopCarePlan';

const handleStopCarePlan = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: STOP_CAREPLAN,
      variables,
    });
    const { stopCarePlan } = result?.data;
    return stopCarePlan;
  } catch (error) {
    throw error;
  }
};

export default handleStopCarePlan;
