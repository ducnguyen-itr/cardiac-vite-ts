import createClient from '../../apolloClient';
import BIOFLUX_STOP_STUDY from '../../Mutations/Bioflux0stopStudy';

const handleBiofluxStopStudy = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: BIOFLUX_STOP_STUDY,
      variables,
    });
    const { Bioflux0stopStudy } = result?.data;
    if (!Bioflux0stopStudy?.isSuccess) {
      throw Bioflux0stopStudy.message;
    }
    return Bioflux0stopStudy?.isSuccess;
  } catch (error) {
    throw error;
  }
};

export default handleBiofluxStopStudy;
