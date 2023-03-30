import createClient from '../../apolloClient';
import MARK_AS_READ_CARE_PLAN from '../../Mutations/markAsReadCarePlan';

const handleMarkAsReadCarePlan = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: MARK_AS_READ_CARE_PLAN,
      variables,
    });
    const { markAsReadCarePlan } = result?.data;
    if (!markAsReadCarePlan?.isSuccess) throw markAsReadCarePlan.message;
    return markAsReadCarePlan;
  } catch (error) {
    throw error;
  }
};

export default handleMarkAsReadCarePlan;
