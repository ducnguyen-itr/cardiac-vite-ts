import createClient from '../../apolloClient';
import SWITCH_CAREPLAN from '../../Mutations/switchCarePlan';

const handleSwitchCarePlan = async (variables) => {
  const client = await createClient();
  const result = await client.mutate({
    mutation: SWITCH_CAREPLAN,
    variables,
  });
  const { switchCarePlan } = result?.data;
  return switchCarePlan;
};

export default handleSwitchCarePlan;
