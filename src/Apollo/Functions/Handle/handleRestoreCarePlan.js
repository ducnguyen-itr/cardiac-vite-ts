import createClient from '../../apolloClient';
import RESTORE_CARE_PLAN from '../../Mutations/restoreCarePlan';

const handleRestoreCarePlan = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: RESTORE_CARE_PLAN,
      variables,
    });
    const { restoreCarePlan } = result?.data;
    if (!restoreCarePlan?.isSuccess) {
      throw restoreCarePlan.message;
    }
    return restoreCarePlan;
  } catch (error) {
    throw error;
  }
};

export default handleRestoreCarePlan;
