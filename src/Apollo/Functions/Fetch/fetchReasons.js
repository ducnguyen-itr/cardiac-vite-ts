import createClient from '../../apolloClient';
import REASONS from '../../Queries/reasons';

const fetchReasons = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: REASONS,
      variables,
    });

    const { reasons } = result?.data || [];
    return reasons;
  } catch (error) {
    throw error;
  }
};

export default fetchReasons;
