import createClient from '../../apolloClient';
import ICD_CODES from '../../Queries/icdCodes';

const fetchIcdCodes = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: ICD_CODES,
    variables,
  });
  const { icdCodes } = result?.data || {};
  return icdCodes;
};

export default fetchIcdCodes;
