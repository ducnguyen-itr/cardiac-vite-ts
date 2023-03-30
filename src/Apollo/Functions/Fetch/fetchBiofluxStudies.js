import createClient from '../../apolloClient';
import BIOFLUX_STUDIES from '../../Queries/biofluxStudies';

const fetchBiofluxStudies = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BIOFLUX_STUDIES,
      variables,
    });
    const { biofluxStudies } = result?.data || {};
    return biofluxStudies;
  } catch (error) {
    throw error;
  }
};

export default fetchBiofluxStudies;
