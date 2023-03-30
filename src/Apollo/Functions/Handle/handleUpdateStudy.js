import createClient from '../../apolloClient';
import BIOFLUX_UPDATE_STUDY from '../../Mutations/Bioflux0updateStudy';

const handleUpdateStudy = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: BIOFLUX_UPDATE_STUDY,
      variables,
    });
    const { Bioflux0updateStudy } = result?.data;
    if (!Bioflux0updateStudy?.isSuccess) throw Bioflux0updateStudy.message;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateStudy;
