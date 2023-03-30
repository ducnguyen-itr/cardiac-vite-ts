import createClient from '../../apolloClient';
import BIOFLUX_CREATE_STUDY from '../../Mutations/bioflux0createStudy';


const handleCreateStudy = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: BIOFLUX_CREATE_STUDY,
      variables,
    });
    const { Bioflux0createStudy } = result?.data;
    if (!Bioflux0createStudy?.isSuccess) throw Bioflux0createStudy.message;
    return Bioflux0createStudy.isSuccess;
  } catch (error) {
    throw error;
  }
};

export default handleCreateStudy;
