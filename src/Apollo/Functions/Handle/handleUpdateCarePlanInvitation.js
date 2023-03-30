import createClient from '../../apolloClient';
import UPDATE_CAREPLAN_INVITATION from '../../Mutations/updateCarePlanInvitation';

const handleUpdateCarePlanInvitation = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_CAREPLAN_INVITATION,
      variables,
    });
    const { updateCarePlanInvitation } = result?.data;
    // if (!resendPassword?.isSuccess) {
    //   throw resendPassword.message;
    // }
    return updateCarePlanInvitation || {};
  } catch (error) {
    throw error;
  }
};

export default handleUpdateCarePlanInvitation;
