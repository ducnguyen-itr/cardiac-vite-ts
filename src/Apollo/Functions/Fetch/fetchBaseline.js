import createClient from '../../apolloClient';
import QUERY_BASELINE from '../../Queries/baseline';

const fetchBaseline = async (variables, key = 0) => {
  const client = await createClient();
  const result = await client.query({
    query: QUERY_BASELINE(key),
    variables,
  });
  return result?.data?.baseline;
};

export default fetchBaseline;
