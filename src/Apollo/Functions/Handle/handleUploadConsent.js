
import createClient from '../../apolloClient';
import UPLOAD_CONSENT from '../../Mutations/uploadConsent';

const handleUploadConsent = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: UPLOAD_CONSENT,
      variables,
    });
    const { uploadConsent } = result?.data || {};
    if (!uploadConsent?.isSuccess) throw uploadConsent.message;
    return uploadConsent;
  } catch (error) {
    throw error;
  }
};
export default handleUploadConsent;
