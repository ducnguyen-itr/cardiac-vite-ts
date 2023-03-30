import createClient from '../../apolloClient';
import CURRENT_BIOFLUX_STUDY from '../../Queries/currentBiofluxStudy';

const fetchCurrentBiofluxStudy = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CURRENT_BIOFLUX_STUDY,
      variables,
    });
    const { currentBiofluxStudy } = result?.data || {};
    return currentBiofluxStudy;
  } catch (error) {
    throw error;
  }
};

export default fetchCurrentBiofluxStudy;
