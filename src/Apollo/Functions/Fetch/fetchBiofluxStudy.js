import createClient from '../../apolloClient';
import BIOFLUX_STUDY_QUERY from '../../Queries/biofluxStudy';

const fetchBiofluxStudy = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BIOFLUX_STUDY_QUERY,
      variables,
    });
    const { biofluxStudy } = result?.data || {};
    return biofluxStudy;
  } catch (error) {
    throw error;
  }
};

export default fetchBiofluxStudy;
