import createClient from '../../apolloClient';
import BIOFLUX_0_FACILITY from '../../Queries/Bioflux0facility';

const fetchBioflux0facility = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BIOFLUX_0_FACILITY,
      variables,
    });
    const { data } = result;
    const { Bioflux0facility } = data;
    return Bioflux0facility;
  } catch (error) {
    throw error;
  }
};

export default fetchBioflux0facility;
