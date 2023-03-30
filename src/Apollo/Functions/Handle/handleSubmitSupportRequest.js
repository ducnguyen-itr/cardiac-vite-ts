import createClient from '../../apolloClient';
import BIOFLUX_SUBMIT_SUPPORT_REQUEST from '../../Mutations/Bioflux0submitSupportRequest';

const handleSubmitSupportRequest = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: BIOFLUX_SUBMIT_SUPPORT_REQUEST,
      variables,
    });
    const { Bioflux0submitSupportRequest } = result?.data;
    return Bioflux0submitSupportRequest;
  } catch (error) {
    throw error;
  }
};

export default handleSubmitSupportRequest;
