import createClient from '../../apolloClient';
import UPDATE_CAREPLAN_ASSIGNEE from '../../Mutations/updateCarePlanAssignee';

const handleUpdateCarePlanAssignee = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_CAREPLAN_ASSIGNEE,
      variables,
    });
    const { updateCarePlanAssignee } = result?.data;
    if (!updateCarePlanAssignee?.isSuccess) throw updateCarePlanAssignee.message;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateCarePlanAssignee;
