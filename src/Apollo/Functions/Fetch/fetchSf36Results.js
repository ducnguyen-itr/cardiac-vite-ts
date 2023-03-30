import createClient from '../../apolloClient';
import SF36_RESULTS from '../../Queries/sf36Results';

const fetchSf36Results = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: SF36_RESULTS,
      variables,
    });
    const { sf36Results } = result?.data || {};
    return sf36Results;
  } catch (error) {
    throw error;
  }
};

export default fetchSf36Results;
