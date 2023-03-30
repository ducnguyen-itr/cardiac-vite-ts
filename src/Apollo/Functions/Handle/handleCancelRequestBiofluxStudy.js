import createClient from '../../apolloClient';
import CANCEL_REQUEST_BIOFLUX_STUDY from '../../Mutations/cancelRequestBiofluxStudy';

const handleCancelRequestBiofluxStudy = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CANCEL_REQUEST_BIOFLUX_STUDY,
      variables,
    });
    const { cancelRequestBiofluxStudy } = result?.data;
    if (!cancelRequestBiofluxStudy?.isSuccess) {
      throw cancelRequestBiofluxStudy.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleCancelRequestBiofluxStudy;
