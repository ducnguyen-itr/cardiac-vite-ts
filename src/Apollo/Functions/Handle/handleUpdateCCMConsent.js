
import createClient from '../../apolloClient';
import UPDATE_CCM_CONSENT from '../../Mutations/updateCCMConsent';

const handleUpdateCCMConsent = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: UPDATE_CCM_CONSENT,
      variables,
    });
    const { updateCCMConsent } = result?.data || {};
    if (!updateCCMConsent?.isSuccess) throw updateCCMConsent.message;
    return updateCCMConsent;
  } catch (error) {
    throw error;
  }
};
export default handleUpdateCCMConsent;
