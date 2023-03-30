import createClient from '../../apolloClient';
import LATEST_ICD_CODES from '../../Queries/latestIcdCodes';

const fetchLatestIcdCodes = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: LATEST_ICD_CODES,
    variables,
  });
  return result?.data?.latestIcdCodes;
};

export default fetchLatestIcdCodes;
