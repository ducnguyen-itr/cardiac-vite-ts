import createClient from '../../apolloClient';
import RESEND_PASSWORD from '../../Mutations/resendPassword';

const handleResendPassword = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: RESEND_PASSWORD,
      variables,
    });
    const { resendPassword } = result?.data;
    // if (!resendPassword?.isSuccess) {
    //   throw resendPassword.message;
    // }
    return resendPassword || {};
  } catch (error) {
    throw error;
  }
};

export default handleResendPassword;
