
import createClient from '../../apolloClient';
import INSIGHT_QUERY from '../../Queries/insight';

const fetchInsight = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: INSIGHT_QUERY,
      variables,
    });
    const { insight } = result?.data || {};
    return insight;
  } catch (error) {
    throw error;
  }
};

export default fetchInsight;
