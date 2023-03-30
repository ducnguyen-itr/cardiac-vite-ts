import createClient from '../../apolloClient';
import REQUEST_BIOFLUX_STUDY from '../../Mutations/requestBiofluxStudy';

const handleRequestBiofluxStudy = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: REQUEST_BIOFLUX_STUDY,
      variables,
    });
    const { requestBiofluxStudy } = result?.data;
    if (!requestBiofluxStudy?.isSuccess) {
      throw requestBiofluxStudy.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleRequestBiofluxStudy;
