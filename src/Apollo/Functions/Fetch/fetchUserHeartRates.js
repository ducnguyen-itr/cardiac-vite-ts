import createClient from '../../apolloClient';
import QUERY_USER_HEART_RATES from '../../Queries/userHeartRates';

const fetchUserHeartRates = async ({ variables, type }) => {
  const client = await createClient();
  const result = await client.query({
    query: QUERY_USER_HEART_RATES(type),
    variables,
  });
  const { userHeartRates } = result?.data || {};
  return userHeartRates;
};

export default fetchUserHeartRates;
