import createClient from '../../apolloClient';
import QUERY_HEART_RATES from '../../Queries/heartRates';

const fetchHeartRates = async (variables, type) => {
  const client = await createClient();
  const result = await client.query({
    query: QUERY_HEART_RATES(type),
    variables,
  });
  const { holidays } = result?.data || {};
  return holidays;
};

export default fetchHeartRates;
