import createClient from '../../apolloClient';
import BIOFLUX_0_STUDY from '../../Queries/bioflux0study';

const fetchBioflux0Study = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BIOFLUX_0_STUDY,
      variables,
    });
    return result?.data?.Bioflux0study;
  } catch (err) {
    throw err;
  }
};
export default fetchBioflux0Study;
