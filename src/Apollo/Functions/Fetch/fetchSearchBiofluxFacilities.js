import createClient from '../../apolloClient';
import SEARCH_BIOFLUX_FACILITIES from '../../Queries/searchBiofluxFacilities';

const fetchSearchBiofluxFacilities = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: SEARCH_BIOFLUX_FACILITIES,
      variables,
    });
    return result?.data?.searchBiofluxFacilities || [];
  } catch (error) {
    throw error;
  }
};

export default fetchSearchBiofluxFacilities;
