import createClient from '../../apolloClient';
import RESEND_REFERENCE_CODE from '../../Mutations/resendReferenceCode';

const handleResendReferenceCode = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: RESEND_REFERENCE_CODE,
      variables,
    });
    const { resendReferenceCode } = result?.data;
    // if (!resendPassword?.isSuccess) {
    //   throw resendPassword.message;
    // }
    return resendReferenceCode || {};
  } catch (error) {
    throw error;
  }
};

export default handleResendReferenceCode;
