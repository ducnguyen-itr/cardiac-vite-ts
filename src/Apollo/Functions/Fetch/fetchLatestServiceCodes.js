import createClient from '../../apolloClient';
import LATEST_SERVICE_CODES from '../../Queries/latestServiceCodes';

const fetchLatestServiceCodes = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: LATEST_SERVICE_CODES,
    variables,
  });
  return result?.data?.latestServiceCodes;
};

export default fetchLatestServiceCodes;
