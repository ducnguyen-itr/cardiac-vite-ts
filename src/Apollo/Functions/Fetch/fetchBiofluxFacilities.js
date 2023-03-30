import createClient from '../../apolloClient';
import BIOFLUX_FACILITIES from '../../Queries/biofluxFacilities';

const fetchBiofluxFacilities = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BIOFLUX_FACILITIES,
      variables,
    });
    return result?.data?.biofluxFacilities || [];
  } catch (error) {
    throw error;
  }
};

export default fetchBiofluxFacilities;
